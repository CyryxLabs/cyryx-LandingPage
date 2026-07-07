ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS handled_at timestamptz,
  ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_handled ON public.contact_submissions (handled_at);

GRANT ALL ON public.contact_submissions TO service_role;
GRANT ALL ON public.newsletter_subscribers TO service_role;
GRANT ALL ON public.cta_events TO service_role;
GRANT ALL ON public.rate_limit_events TO service_role;
GRANT ALL ON public.email_send_log TO service_role;