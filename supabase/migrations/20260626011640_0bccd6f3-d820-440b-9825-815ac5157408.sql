
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- Recreate has_role inside the private schema (not exposed via PostgREST)
CREATE OR REPLACE FUNCTION private.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
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

-- Repoint policies to private.has_role, then drop the public wrapper
DROP POLICY "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can read web vitals" ON public.web_vitals;
CREATE POLICY "Admins can read web vitals"
ON public.web_vitals FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(UUID, public.app_role);
