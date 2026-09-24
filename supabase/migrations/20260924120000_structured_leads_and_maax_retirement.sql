-- Structured lead qualification + attribution, assistant-sourced leads, and
-- retirement of the public MAAX Studio waitlist entry points.
--
-- Backward compatible: submit_contact_public (v1) is unchanged. The website
-- calls submit_contact_public_v2 and falls back to v1 while this migration is
-- not yet applied.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS qualification jsonb,
  ADD COLUMN IF NOT EXISTS attribution jsonb,
  ADD COLUMN IF NOT EXISTS ai_first_reply text;

COMMENT ON COLUMN public.contact_submissions.qualification IS
  'Structured qualification fields from the /start form (project type, stage, investment, timeline, decision role...).';
COMMENT ON COLUMN public.contact_submissions.attribution IS
  'First-touch attribution: allow-listed utm_* values, referrer origin+path, landing path, copy variant.';
COMMENT ON COLUMN public.contact_submissions.ai_first_reply IS
  'Instant first reply drafted by the website AI system and shown/sent to the submitter.';

CREATE OR REPLACE FUNCTION public.submit_contact_public_v2(
  p_name text,
  p_email text,
  p_company text,
  p_message text,
  p_interest text DEFAULT 'project',
  p_consent_version text DEFAULT 'website-contact-v2',
  p_ip_hash text DEFAULT NULL,
  p_user_agent_hash text DEFAULT NULL,
  p_qualification jsonb DEFAULT NULL,
  p_attribution jsonb DEFAULT NULL
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
  v_project_type text := left(coalesce(p_qualification ->> 'project_type', ''), 80);
  v_contact_id uuid;
  v_submission_id uuid;
BEGIN
  IF char_length(v_name) NOT BETWEEN 1 AND 100
     OR char_length(v_email) NOT BETWEEN 3 AND 255
     OR position('@' IN v_email) < 2
     OR char_length(v_message) NOT BETWEEN 10 AND 6000
     OR (v_company IS NOT NULL AND char_length(v_company) > 160)
     OR v_interest NOT IN ('project', 'research', 'other', 'assistant')
     OR char_length(trim(p_consent_version)) NOT BETWEEN 3 AND 80
     OR (p_qualification IS NOT NULL AND (jsonb_typeof(p_qualification) <> 'object' OR pg_column_size(p_qualification) > 8000))
     OR (p_attribution IS NOT NULL AND (jsonb_typeof(p_attribution) <> 'object' OR pg_column_size(p_attribution) > 4000)) THEN
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
    name, email, company, message, interest, consent_version, consent_given_at,
    ip_hash, user_agent_hash, qualification, attribution
  )
  VALUES (
    v_name, v_email, v_company, v_message, v_interest, left(trim(p_consent_version), 80), now(),
    left(p_ip_hash, 64), left(p_user_agent_hash, 64), p_qualification, p_attribution
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
      concat_ws(' · ', 'Captured through Start a project', v_company, nullif(v_project_type, ''))
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
      concat_ws(
        ' · ',
        'Website qualification form',
        'interest=' || v_interest,
        nullif('type=' || v_project_type, 'type='),
        nullif('budget=' || coalesce(p_qualification ->> 'investment', ''), 'budget='),
        nullif('timeline=' || coalesce(p_qualification ->> 'timeline', ''), 'timeline='),
        nullif('utm_source=' || coalesce(p_attribution ->> 'utm_source', ''), 'utm_source=')
      )
    );
  END IF;

  RETURN jsonb_build_object('ok', true, 'id', v_submission_id);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_public_v2(
  text, text, text, text, text, text, text, text, jsonb, jsonb
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_public_v2(
  text, text, text, text, text, text, text, text, jsonb, jsonb
) TO anon, authenticated, service_role;

-- Store the instant AI first reply against its submission (server-side only).
CREATE OR REPLACE FUNCTION public.record_contact_ai_reply(p_submission_id uuid, p_reply text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE public.contact_submissions
  SET ai_first_reply = left(p_reply, 4000)
  WHERE id = p_submission_id
    AND ai_first_reply IS NULL
    AND created_at >= now() - interval '10 minutes';
$$;

REVOKE ALL ON FUNCTION public.record_contact_ai_reply(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_contact_ai_reply(uuid, text) TO anon, authenticated, service_role;

-- MAAX Studio was discontinued (Sep 2026). Keep public.maax_waitlist for data
-- retention and export, but close the public write paths.
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('join_maax_waitlist', 'join_maax_waitlist_v2')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated', fn.signature);
  END LOOP;
END
$$;
