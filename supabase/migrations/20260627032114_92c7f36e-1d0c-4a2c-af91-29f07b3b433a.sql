
-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  consent_given_at timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contact_submissions_ip_created
  ON public.contact_submissions (ip_hash, created_at DESC);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: only service_role (backend) may access.

-- Newsletter double opt-in subscribers
CREATE TYPE public.newsletter_status AS ENUM ('pending', 'confirmed', 'unsubscribed');

CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  status public.newsletter_status NOT NULL DEFAULT 'pending',
  confirm_token text UNIQUE,
  confirm_token_expires_at timestamptz,
  consent_given_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_newsletter_subscribers_ip_created
  ON public.newsletter_subscribers (ip_hash, created_at DESC);
CREATE INDEX idx_newsletter_subscribers_status
  ON public.newsletter_subscribers (status);
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_newsletter_subscribers()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_touch_newsletter_subscribers
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.touch_newsletter_subscribers();
