CREATE TABLE public.cta_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cta text NOT NULL,
  section text NOT NULL,
  path text NOT NULL,
  href text,
  variant text,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(cta) BETWEEN 1 AND 64),
  CHECK (length(section) BETWEEN 1 AND 64),
  CHECK (length(path) BETWEEN 1 AND 2048),
  CHECK (href IS NULL OR length(href) <= 2048),
  CHECK (variant IS NULL OR length(variant) <= 32),
  CHECK (user_agent IS NULL OR length(user_agent) <= 1024),
  CHECK (referrer IS NULL OR length(referrer) <= 2048)
);

GRANT INSERT ON public.cta_events TO anon, authenticated;
GRANT SELECT ON public.cta_events TO authenticated;
GRANT ALL ON public.cta_events TO service_role;

ALTER TABLE public.cta_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert CTA events"
  ON public.cta_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(cta) BETWEEN 1 AND 64
    AND length(section) BETWEEN 1 AND 64
    AND length(path) BETWEEN 1 AND 2048
  );

CREATE POLICY "Admins read CTA events"
  ON public.cta_events FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX cta_events_created_at_idx ON public.cta_events (created_at DESC);
CREATE INDEX cta_events_cta_section_idx ON public.cta_events (cta, section, created_at DESC);