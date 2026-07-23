-- Allow the public contact funnel to persist through a narrow RPC without
-- exposing direct table writes or requiring SUPABASE_SERVICE_ROLE_KEY.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS interest text,
  ADD COLUMN IF NOT EXISTS consent_version text NOT NULL DEFAULT 'website-contact-v1';

CREATE OR REPLACE FUNCTION public.submit_contact_public(
  p_name text,
  p_email text,
  p_company text,
  p_message text,
  p_interest text DEFAULT 'project',
  p_consent_version text DEFAULT 'website-contact-v1',
  p_ip_hash text DEFAULT NULL,
  p_user_agent_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_name text := trim(p_name);
  v_email text := lower(trim(p_email));
  v_company text := nullif(trim(p_company), '');
  v_message text := trim(p_message);
  v_interest text := coalesce(nullif(trim(p_interest), ''), 'project');
  v_contact_id uuid;
  v_submission_id uuid;
BEGIN
  IF char_length(v_name) NOT BETWEEN 1 AND 100
     OR char_length(v_email) NOT BETWEEN 3 AND 255
     OR position('@' IN v_email) < 2
     OR char_length(v_message) NOT BETWEEN 10 AND 2000
     OR (v_company IS NOT NULL AND char_length(v_company) > 120)
     OR v_interest NOT IN ('project', 'maax-early-access', 'research', 'other')
     OR char_length(trim(p_consent_version)) NOT BETWEEN 3 AND 80 THEN
    RAISE EXCEPTION 'invalid_payload';
  END IF;

  IF (
    SELECT count(*)
    FROM public.contact_submissions
    WHERE created_at >= now() - interval '1 hour'
      AND (
        (p_ip_hash IS NOT NULL AND ip_hash = p_ip_hash)
        OR lower(email) = v_email
      )
  ) >= 5 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  INSERT INTO public.contact_submissions (
    name,
    email,
    company,
    message,
    interest,
    consent_version,
    consent_given_at,
    ip_hash,
    user_agent_hash
  )
  VALUES (
    v_name,
    v_email,
    v_company,
    v_message,
    v_interest,
    left(trim(p_consent_version), 80),
    now(),
    left(p_ip_hash, 64),
    left(p_user_agent_hash, 64)
  )
  RETURNING id INTO v_submission_id;

  SELECT id INTO v_contact_id
  FROM public.crm_contacts
  WHERE lower(email) = v_email
  ORDER BY created_at
  LIMIT 1;

  IF v_contact_id IS NULL THEN
    INSERT INTO public.crm_contacts (full_name, email, tags, notes)
    VALUES (
      v_name,
      v_email,
      ARRAY['website-inquiry', v_interest]::text[],
      concat_ws(' · ', 'Captured through Start a Project', v_company)
    )
    RETURNING id INTO v_contact_id;
  ELSE
    UPDATE public.crm_contacts
    SET
      full_name = v_name,
      tags = (
        SELECT ARRAY(
          SELECT DISTINCT tag
          FROM unnest(coalesce(tags, ARRAY[]::text[]) || ARRAY['website-inquiry', v_interest]) tag
        )
      )
    WHERE id = v_contact_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.mkt_leads
    WHERE contact_id = v_contact_id
      AND source = 'website_start_project'
  ) THEN
    INSERT INTO public.mkt_leads (contact_id, source, notes)
    VALUES (
      v_contact_id,
      'website_start_project',
      concat_ws(' · ', 'Website qualification form', 'interest=' || v_interest)
    );
  END IF;

  RETURN jsonb_build_object('ok', true, 'id', v_submission_id);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_public(
  text, text, text, text, text, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_public(
  text, text, text, text, text, text, text, text
) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.submit_contact_public(
  text, text, text, text, text, text, text, text
) IS
  'Validates and persists website contact submissions without exposing direct table access.';
