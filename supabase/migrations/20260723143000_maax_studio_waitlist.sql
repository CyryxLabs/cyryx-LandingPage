-- MAAX Studio early-access funnel.
-- Public submissions are accepted only through a narrow SECURITY DEFINER RPC.

ALTER TABLE public.crm_contacts
  ADD COLUMN IF NOT EXISTS country text;

CREATE TABLE IF NOT EXISTS public.maax_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 40),
  country text NOT NULL CHECK (char_length(country) BETWEEN 2 AND 80),
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'qualified', 'invited', 'onboarded', 'declined', 'unsubscribed')),
  source text NOT NULL DEFAULT 'maax_studio_waitlist',
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  consent_version text NOT NULL,
  consent_given_at timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent_hash text,
  crm_contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  marketing_lead_id uuid REFERENCES public.mkt_leads(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS maax_waitlist_email_unique
  ON public.maax_waitlist ((lower(email)));
CREATE INDEX IF NOT EXISTS maax_waitlist_created_at_idx
  ON public.maax_waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS maax_waitlist_status_idx
  ON public.maax_waitlist (status, created_at DESC);
CREATE INDEX IF NOT EXISTS maax_waitlist_ip_rate_idx
  ON public.maax_waitlist (ip_hash, created_at DESC);

ALTER TABLE public.maax_waitlist ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.maax_waitlist FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.maax_waitlist TO authenticated;
GRANT ALL ON public.maax_waitlist TO service_role;

DROP POLICY IF EXISTS maax_waitlist_admin ON public.maax_waitlist;
CREATE POLICY maax_waitlist_admin
  ON public.maax_waitlist
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS trg_maax_waitlist_updated ON public.maax_waitlist;
CREATE TRIGGER trg_maax_waitlist_updated
  BEFORE UPDATE ON public.maax_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.join_maax_waitlist(
  p_full_name text,
  p_email text,
  p_phone text,
  p_country text,
  p_consent_version text,
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
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_full_name text := trim(p_full_name);
  v_phone text := trim(p_phone);
  v_country text := trim(p_country);
  v_contact_id uuid;
  v_lead_id uuid;
  v_waitlist_id uuid;
BEGIN
  IF char_length(v_full_name) NOT BETWEEN 2 AND 120
     OR char_length(v_email) NOT BETWEEN 3 AND 254
     OR position('@' IN v_email) < 2
     OR char_length(v_phone) NOT BETWEEN 7 AND 40
     OR char_length(v_country) NOT BETWEEN 2 AND 80
     OR char_length(trim(p_consent_version)) NOT BETWEEN 3 AND 80 THEN
    RAISE EXCEPTION 'invalid_payload';
  END IF;

  IF p_ip_hash IS NOT NULL
     AND (
       SELECT count(*)
       FROM public.maax_waitlist
       WHERE ip_hash = p_ip_hash
         AND created_at >= now() - interval '1 hour'
     ) >= 5
     AND NOT EXISTS (
       SELECT 1 FROM public.maax_waitlist WHERE lower(email) = v_email
     ) THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  SELECT id INTO v_contact_id
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
    UPDATE public.crm_contacts
    SET
      full_name = v_full_name,
      phone = v_phone,
      country = v_country,
      tags = (
        SELECT ARRAY(
          SELECT DISTINCT tag
          FROM unnest(coalesce(tags, ARRAY[]::text[]) || ARRAY['maax-studio', 'waitlist']) tag
        )
      )
    WHERE id = v_contact_id;
  END IF;

  SELECT id INTO v_lead_id
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
        CASE WHEN p_utm_campaign IS NOT NULL THEN 'campaign=' || left(p_utm_campaign, 255) END,
        CASE WHEN p_utm_source IS NOT NULL THEN 'source=' || left(p_utm_source, 255) END
      )
    )
    RETURNING id INTO v_lead_id;
  END IF;

  INSERT INTO public.maax_waitlist (
    full_name,
    email,
    phone,
    country,
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
    'waiting',
    left(coalesce(nullif(trim(p_source), ''), 'maax_studio_waitlist'), 64),
    left(p_landing_path, 2048),
    left(p_referrer, 2048),
    left(p_utm_source, 255),
    left(p_utm_medium, 255),
    left(p_utm_campaign, 255),
    left(p_utm_content, 255),
    left(p_utm_term, 255),
    left(trim(p_consent_version), 80),
    now(),
    left(p_ip_hash, 64),
    left(p_user_agent_hash, 64),
    v_contact_id,
    v_lead_id
  )
  ON CONFLICT ((lower(email))) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    country = EXCLUDED.country,
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
    consent_given_at = now(),
    ip_hash = EXCLUDED.ip_hash,
    user_agent_hash = EXCLUDED.user_agent_hash,
    crm_contact_id = EXCLUDED.crm_contact_id,
    marketing_lead_id = EXCLUDED.marketing_lead_id
  RETURNING id INTO v_waitlist_id;

  RETURN jsonb_build_object('ok', true, 'id', v_waitlist_id);
END;
$$;

REVOKE ALL ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) TO anon, authenticated, service_role;

COMMENT ON TABLE public.maax_waitlist IS
  'Consent and attribution record for MAAX Studio early-access requests.';
COMMENT ON FUNCTION public.join_maax_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) IS
  'Validates and synchronizes a MAAX early-access request into CRM and Marketing without exposing table writes.';
