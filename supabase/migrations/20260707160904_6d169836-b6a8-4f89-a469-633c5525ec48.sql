
CREATE TABLE public.auth_domain_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('sign_in','password_recovery')),
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.auth_domain_blocks TO service_role;

ALTER TABLE public.auth_domain_blocks ENABLE ROW LEVEL SECURITY;

CREATE INDEX auth_domain_blocks_created_at_idx ON public.auth_domain_blocks (created_at DESC);
CREATE INDEX auth_domain_blocks_ip_hash_idx ON public.auth_domain_blocks (ip_hash, created_at DESC);
