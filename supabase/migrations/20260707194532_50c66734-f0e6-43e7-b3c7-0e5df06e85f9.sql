
-- Bootstrap admin for ppetruff@cyryxlabs.com and enable role-based invitation flow.
-- Auto-grant admin role when this email signs up or is confirmed.

CREATE OR REPLACE FUNCTION public.bootstrap_admin_ppetruff()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'ppetruff@cyryxlabs.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.bootstrap_admin_ppetruff();

DROP TRIGGER IF EXISTS on_auth_user_confirmed_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_bootstrap_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.bootstrap_admin_ppetruff();

-- If the user already exists (previous sign-up attempt), grant role now.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE lower(email) = 'ppetruff@cyryxlabs.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- has_role helper (idempotent) used by server-side admin gate.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
