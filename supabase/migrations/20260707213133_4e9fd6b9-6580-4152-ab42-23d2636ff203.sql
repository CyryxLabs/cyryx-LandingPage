
-- Phase 1: universal watchers + notification triggers

CREATE TABLE public.ws_watchers (
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_type, entity_id, user_id)
);
CREATE INDEX idx_ws_watchers_entity ON public.ws_watchers(entity_type, entity_id);
CREATE INDEX idx_ws_watchers_user ON public.ws_watchers(user_id);

GRANT SELECT, INSERT, DELETE ON public.ws_watchers TO authenticated;
GRANT ALL ON public.ws_watchers TO service_role;

ALTER TABLE public.ws_watchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_watchers_read" ON public.ws_watchers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "ws_watchers_insert_self" ON public.ws_watchers
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ws_watchers_delete_self_or_admin" ON public.ws_watchers
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Notify watchers when a new comment lands
CREATE OR REPLACE FUNCTION public.notify_watchers_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_email text;
  actor_label text;
  entity_url text;
BEGIN
  SELECT email INTO actor_email FROM auth.users WHERE id = NEW.author_id;
  actor_label := COALESCE(split_part(actor_email, '@', 1), 'Someone');
  entity_url := '/workspace?entity=' || NEW.entity_type || ':' || NEW.entity_id::text;

  -- Watchers on ws_watchers (deals, candidates, ...)
  INSERT INTO public.ws_notifications (user_id, actor_id, kind, entity_type, entity_id, title, body, url)
  SELECT w.user_id, NEW.author_id, 'comment', NEW.entity_type, NEW.entity_id,
         actor_label || ' commented',
         left(NEW.body, 240),
         entity_url
  FROM public.ws_watchers w
  WHERE w.entity_type = NEW.entity_type
    AND w.entity_id = NEW.entity_id
    AND w.user_id <> NEW.author_id;

  -- Task watchers live on pm_task_watchers
  IF NEW.entity_type = 'pm_tasks' THEN
    INSERT INTO public.ws_notifications (user_id, actor_id, kind, entity_type, entity_id, title, body, url)
    SELECT tw.user_id, NEW.author_id, 'comment', NEW.entity_type, NEW.entity_id,
           actor_label || ' commented',
           left(NEW.body, 240),
           entity_url
    FROM public.pm_task_watchers tw
    WHERE tw.task_id = NEW.entity_id
      AND tw.user_id <> NEW.author_id
      AND NOT EXISTS (
        SELECT 1 FROM public.ws_watchers w
         WHERE w.entity_type = 'pm_tasks' AND w.entity_id = NEW.entity_id AND w.user_id = tw.user_id
      );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_watchers_on_comment
AFTER INSERT ON public.ws_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_watchers_on_comment();

-- Notify new assignee when a task is assigned or reassigned
CREATE OR REPLACE FUNCTION public.notify_assignee_on_task_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE actor_id uuid;
BEGIN
  actor_id := auth.uid();
  IF NEW.assignee_id IS NOT NULL
     AND NEW.assignee_id <> actor_id
     AND (TG_OP = 'INSERT' OR NEW.assignee_id IS DISTINCT FROM OLD.assignee_id) THEN
    INSERT INTO public.ws_notifications
      (user_id, actor_id, kind, entity_type, entity_id, title, body, url)
    VALUES
      (NEW.assignee_id, actor_id, 'assigned', 'pm_tasks', NEW.id,
       'Task assigned to you',
       NEW.title,
       '/workspace/dev?entity=pm_tasks:' || NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_assignee_on_task_insert
AFTER INSERT ON public.pm_tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_assignee_on_task_change();

CREATE TRIGGER trg_notify_assignee_on_task_update
AFTER UPDATE OF assignee_id ON public.pm_tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_assignee_on_task_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.ws_notifications;
