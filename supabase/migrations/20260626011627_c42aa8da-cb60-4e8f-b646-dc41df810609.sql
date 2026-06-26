
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

DROP POLICY "Anyone can insert web vitals beacons" ON public.web_vitals;
CREATE POLICY "Anyone can insert web vitals beacons"
ON public.web_vitals FOR INSERT
TO anon, authenticated
WITH CHECK (
  metric_value >= 0
  AND metric_value < 1000000
  AND length(path) BETWEEN 1 AND 2048
  AND (user_agent IS NULL OR length(user_agent) < 1024)
);
