
CREATE OR REPLACE FUNCTION public.enforce_cyryxlabs_domain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL OR lower(NEW.email) NOT LIKE '%@cyryxlabs.com' THEN
    RAISE LOG 'enforce_cyryxlabs_domain: blocked email=%', NEW.email;
    RAISE EXCEPTION 'Invalid domain: only @cyryxlabs.com accounts are allowed.'
      USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_cyryxlabs_domain_insert ON auth.users;
CREATE TRIGGER enforce_cyryxlabs_domain_insert
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cyryxlabs_domain();

DROP TRIGGER IF EXISTS enforce_cyryxlabs_domain_update ON auth.users;
CREATE TRIGGER enforce_cyryxlabs_domain_update
  BEFORE UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (NEW.email IS DISTINCT FROM OLD.email)
  EXECUTE FUNCTION public.enforce_cyryxlabs_domain();
