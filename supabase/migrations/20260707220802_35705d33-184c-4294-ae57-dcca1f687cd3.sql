
-- RLS policies for workspace-attachments bucket. Path convention: <entity_type>/<entity_id>/<uuid>-<filename>
CREATE POLICY "wsa_read_authenticated"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'workspace-attachments');

CREATE POLICY "wsa_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'workspace-attachments' AND owner = auth.uid());

CREATE POLICY "wsa_delete_own_or_admin"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'workspace-attachments'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'))
);
