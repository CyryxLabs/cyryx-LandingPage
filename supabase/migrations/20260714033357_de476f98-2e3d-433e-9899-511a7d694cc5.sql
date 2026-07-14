
-- 1) Restrict overly-broad SELECT policies on workspace tables.

DROP POLICY IF EXISTS wal_read ON public.ws_activity_log;
CREATE POLICY wal_read ON public.ws_activity_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS wa_read ON public.ws_attachments;
CREATE POLICY wa_read ON public.ws_attachments
  FOR SELECT TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.ws_watchers w
      WHERE w.entity_type = ws_attachments.entity_type
        AND w.entity_id   = ws_attachments.entity_id
        AND w.user_id     = auth.uid()
    )
  );

DROP POLICY IF EXISTS wc_read ON public.ws_comments;
CREATE POLICY wc_read ON public.ws_comments
  FOR SELECT TO authenticated
  USING (
    author_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.ws_watchers w
      WHERE w.entity_type = ws_comments.entity_type
        AND w.entity_id   = ws_comments.entity_id
        AND w.user_id     = auth.uid()
    )
  );

DROP POLICY IF EXISTS ws_watchers_read ON public.ws_watchers;
CREATE POLICY ws_watchers_read ON public.ws_watchers
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.ws_watchers self
      WHERE self.entity_type = ws_watchers.entity_type
        AND self.entity_id   = ws_watchers.entity_id
        AND self.user_id     = auth.uid()
    )
  );

-- 2) Revoke default EXECUTE on SECURITY DEFINER functions from anon/authenticated/PUBLIC.
--    Trigger, cron, and internal helper functions do not need to be directly callable
--    via the Data API. `has_role` MUST stay executable because RLS policies invoke it.

REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_cyryxlabs_domain() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bootstrap_admin_ppetruff() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_from_allowlist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_workspace_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_watchers_on_comment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_assignee_on_task_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reconcile_deal_attribution() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
