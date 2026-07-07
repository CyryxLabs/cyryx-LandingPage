
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email TEXT PRIMARY KEY,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_allowlist TO authenticated;
GRANT ALL ON public.admin_allowlist TO service_role;

ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read allowlist" ON public.admin_allowlist;
CREATE POLICY "Admins can read allowlist"
  ON public.admin_allowlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.admin_allowlist (email, note)
VALUES ('ppetruff@cyryxlabs.com', 'founder bootstrap')
ON CONFLICT (email) DO NOTHING;

-- Auto-grant admin role when a user in the allow-list signs up or gets confirmed.
CREATE OR REPLACE FUNCTION public.grant_admin_from_allowlist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE email = lower(NEW.email)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Replace the previous hard-coded triggers.
DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed_bootstrap_admin ON auth.users;

CREATE TRIGGER on_auth_user_created_admin_allowlist
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_from_allowlist();

CREATE TRIGGER on_auth_user_confirmed_admin_allowlist
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_from_allowlist();

-- Backfill: promote any existing user already in the allow-list.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
JOIN public.admin_allowlist a ON a.email = lower(u.email)
ON CONFLICT (user_id, role) DO NOTHING;
