-- Qualify the MAAX Studio early-access funnel without invalidating historical rows.
--
-- Forward-only rollout:
--   1. Add nullable qualification columns so existing records remain valid.
--   2. Make telephone optional while retaining its existing length constraint.
--   3. Move public submission traffic to a versioned, narrow RPC.
--   4. Revoke public access to the legacy RPC after the v2 contract exists.
--
-- Rollback plan (application rollback required first): revoke EXECUTE on
-- join_maax_waitlist_v2 and re-grant the legacy RPC to anon/authenticated.
-- Keep the added columns and any captured qualification data. Do not restore
-- phone NOT NULL unless every row has been safely backfilled and verified.

ALTER TABLE public.maax_waitlist
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS use_case text,
  ADD COLUMN IF NOT EXISTS operating_constraint text;

ALTER TABLE public.maax_waitlist
  ALTER COLUMN phone DROP NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.maax_waitlist'::regclass
      AND conname = 'maax_waitlist_company_length_check'
  ) THEN
    ALTER TABLE public.maax_waitlist
      ADD CONSTRAINT maax_waitlist_company_length_check
      CHECK (company IS NULL OR char_length(company) BETWEEN 2 AND 160);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.maax_waitlist'::regclass
      AND conname = 'maax_waitlist_role_length_check'
  ) THEN
    ALTER TABLE public.maax_waitlist
      ADD CONSTRAINT maax_waitlist_role_length_check
      CHECK (role IS NULL OR char_length(role) BETWEEN 2 AND 120);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.maax_waitlist'::regclass
      AND conname = 'maax_waitlist_use_case_length_check'
  ) THEN
    ALTER TABLE public.maax_waitlist
      ADD CONSTRAINT maax_waitlist_use_case_length_check
      CHECK (use_case IS NULL OR char_length(use_case) BETWEEN 10 AND 2000);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.maax_waitlist'::regclass
      AND conname = 'maax_waitlist_operating_constraint_length_check'
  ) THEN
    ALTER TABLE public.maax_waitlist
      ADD CONSTRAINT maax_waitlist_operating_constraint_length_check
      CHECK (
        operating_constraint IS NULL
        OR char_length(operating_constraint) BETWEEN 10 AND 2000
      );
  END IF;
END;
$migration$;

-- Preserve the existing RLS boundary and explicitly keep direct public writes closed.
ALTER TABLE public.maax_waitlist ENABLE ROW LEVEL SECURITY;
REVOKE INSERT ON TABLE public.maax_waitlist FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.join_maax_waitlist_v2(
  p_full_name text,
  p_email text,
  p_company text,
  p_role text,
  p_use_case text,
  p_operating_constraint text,
  p_country text,
  p_consent_version text,
  p_phone text DEFAULT NULL,
  p_source text DEFAULT 'maax_studio_waitlist',
  p_landing_path text DEFAULT NULL,
  p_referrer text DEFAULT NULL,
  p_utm_source text DEFAULT NULL,
  p_utm_medium text DEFAULT NULL,
  p_utm_campaign text DEFAULT NULL,
  p_utm_content text DEFAULT NULL,
  p_utm_term text DEFAULT NULL,
  p_ip_hash text DEFAULT NULL,
  p_user_agent_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $function$
DECLARE
  v_email text := lower(trim(p_email));
  v_full_name text := trim(p_full_name);
  v_company text := trim(p_company);
  v_role text := trim(p_role);
  v_use_case text := trim(p_use_case);
  v_operating_constraint text := trim(p_operating_constraint);
  v_country text := trim(p_country);
  v_consent_version text := trim(p_consent_version);
  v_phone text := nullif(trim(p_phone), '');
  v_ip_hash text := left(nullif(trim(p_ip_hash), ''), 64);
  v_user_agent_hash text := left(nullif(trim(p_user_agent_hash), ''), 64);
  v_contact_id uuid;
  v_lead_id uuid;
  v_waitlist_id uuid;
BEGIN
  IF p_full_name IS NULL
     OR p_email IS NULL
     OR p_company IS NULL
     OR p_role IS NULL
     OR p_use_case IS NULL
     OR p_operating_constraint IS NULL
     OR p_country IS NULL
     OR p_consent_version IS NULL
     OR char_length(v_full_name) NOT BETWEEN 2 AND 120
     OR char_length(v_email) NOT BETWEEN 3 AND 254
     OR v_email !~ '^[^[:space:]@]+@[^[:space:]@]+$'
     OR char_length(v_company) NOT BETWEEN 2 AND 160
     OR char_length(v_role) NOT BETWEEN 2 AND 120
     OR char_length(v_use_case) NOT BETWEEN 10 AND 2000
     OR char_length(v_operating_constraint) NOT BETWEEN 10 AND 2000
     OR char_length(v_country) NOT BETWEEN 2 AND 80
     OR v_consent_version <> 'maax-waitlist-v2-2026-08-03'
     OR (
       v_phone IS NOT NULL
       AND (
         char_length(v_phone) NOT BETWEEN 7 AND 40
         OR v_phone !~ '^[0-9+(). /xX-]+$'
       )
     ) THEN
    RAISE EXCEPTION 'invalid_payload';
  END IF;

  -- Preserve the existing abuse limit: five new addresses per IP hash per hour.
  -- Repeat submissions for an existing address remain eligible for an idempotent upsert.
  IF v_ip_hash IS NOT NULL
     AND (
       SELECT count(*)
       FROM public.maax_waitlist
       WHERE ip_hash = v_ip_hash
         AND created_at >= pg_catalog.now() - interval '1 hour'
     ) >= 5
     AND NOT EXISTS (
       SELECT 1
       FROM public.maax_waitlist
       WHERE lower(email) = v_email
     ) THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  SELECT id
  INTO v_contact_id
  FROM public.crm_contacts
  WHERE lower(email) = v_email
  ORDER BY created_at
  LIMIT 1;

  IF v_contact_id IS NULL THEN
    INSERT INTO public.crm_contacts (full_name, email, phone, country, tags, notes)
    VALUES (
      v_full_name,
      v_email,
      v_phone,
      v_country,
      ARRAY['maax-studio', 'waitlist']::text[],
      'Captured through the MAAX Studio early-access list.'
    )
    RETURNING id INTO v_contact_id;
  ELSE
    UPDATE public.crm_contacts AS contact
    SET
      full_name = v_full_name,
      phone = coalesce(v_phone, contact.phone),
      country = v_country,
      tags = (
        SELECT ARRAY(
          SELECT DISTINCT tag
          FROM unnest(
            coalesce(contact.tags, ARRAY[]::text[])
            || ARRAY['maax-studio', 'waitlist']
          ) tag
        )
      )
    WHERE contact.id = v_contact_id;
  END IF;

  SELECT id
  INTO v_lead_id
  FROM public.mkt_leads
  WHERE contact_id = v_contact_id
    AND source = 'maax_studio_waitlist'
  ORDER BY created_at
  LIMIT 1;

  IF v_lead_id IS NULL THEN
    INSERT INTO public.mkt_leads (contact_id, source, notes)
    VALUES (
      v_contact_id,
      'maax_studio_waitlist',
      concat_ws(
        ' · ',
        'MAAX Studio early access',
        CASE
          WHEN nullif(trim(p_utm_campaign), '') IS NOT NULL
          THEN 'campaign=' || left(trim(p_utm_campaign), 255)
        END,
        CASE
          WHEN nullif(trim(p_utm_source), '') IS NOT NULL
          THEN 'source=' || left(trim(p_utm_source), 255)
        END
      )
    )
    RETURNING id INTO v_lead_id;
  END IF;

  INSERT INTO public.maax_waitlist (
    full_name,
    email,
    phone,
    country,
    company,
    role,
    use_case,
    operating_constraint,
    status,
    source,
    landing_path,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    consent_version,
    consent_given_at,
    ip_hash,
    user_agent_hash,
    crm_contact_id,
    marketing_lead_id
  )
  VALUES (
    v_full_name,
    v_email,
    v_phone,
    v_country,
    v_company,
    v_role,
    v_use_case,
    v_operating_constraint,
    'waiting',
    left(coalesce(nullif(trim(p_source), ''), 'maax_studio_waitlist'), 64),
    left(nullif(trim(p_landing_path), ''), 2048),
    left(nullif(trim(p_referrer), ''), 2048),
    left(nullif(trim(p_utm_source), ''), 255),
    left(nullif(trim(p_utm_medium), ''), 255),
    left(nullif(trim(p_utm_campaign), ''), 255),
    left(nullif(trim(p_utm_content), ''), 255),
    left(nullif(trim(p_utm_term), ''), 255),
    left(v_consent_version, 80),
    pg_catalog.now(),
    v_ip_hash,
    v_user_agent_hash,
    v_contact_id,
    v_lead_id
  )
  ON CONFLICT ((lower(email))) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    country = EXCLUDED.country,
    company = EXCLUDED.company,
    role = EXCLUDED.role,
    use_case = EXCLUDED.use_case,
    operating_constraint = EXCLUDED.operating_constraint,
    status = CASE
      WHEN public.maax_waitlist.status = 'unsubscribed' THEN 'waiting'
      ELSE public.maax_waitlist.status
    END,
    source = EXCLUDED.source,
    landing_path = EXCLUDED.landing_path,
    referrer = EXCLUDED.referrer,
    utm_source = EXCLUDED.utm_source,
    utm_medium = EXCLUDED.utm_medium,
    utm_campaign = EXCLUDED.utm_campaign,
    utm_content = EXCLUDED.utm_content,
    utm_term = EXCLUDED.utm_term,
    consent_version = EXCLUDED.consent_version,
    consent_given_at = pg_catalog.now(),
    ip_hash = EXCLUDED.ip_hash,
    user_agent_hash = EXCLUDED.user_agent_hash,
    crm_contact_id = EXCLUDED.crm_contact_id,
    marketing_lead_id = EXCLUDED.marketing_lead_id
  RETURNING id INTO v_waitlist_id;

  RETURN pg_catalog.jsonb_build_object('ok', true, 'id', v_waitlist_id);
END;
$function$;

-- Disable the unqualified legacy public path without dropping it or its history.
REVOKE ALL ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) TO service_role;

REVOKE ALL ON FUNCTION public.join_maax_waitlist_v2(
  text, text, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, text, text, text
) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_maax_waitlist_v2(
  text, text, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, text, text, text
) TO anon, authenticated, service_role;

COMMENT ON COLUMN public.maax_waitlist.company IS
  'Company supplied to qualify a MAAX Studio early-access request.';
COMMENT ON COLUMN public.maax_waitlist.role IS
  'Requestor role supplied to qualify a MAAX Studio early-access request.';
COMMENT ON COLUMN public.maax_waitlist.use_case IS
  'Intended MAAX Studio use case supplied by the requestor.';
COMMENT ON COLUMN public.maax_waitlist.operating_constraint IS
  'Primary operating constraint the requestor wants MAAX Studio to address.';
COMMENT ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) IS
  'Legacy MAAX waitlist submission contract retained for service-role rollback only.';
COMMENT ON FUNCTION public.join_maax_waitlist_v2(
  text, text, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, text, text, text
) IS
  'Validates, rate-limits, and synchronizes a qualified MAAX early-access request without exposing direct table writes.';
