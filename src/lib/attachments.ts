import { supabase } from "@/integrations/supabase/client";

export const ATTACHMENTS_BUCKET = "workspace-attachments";

export function buildAttachmentPath(entity_type: string, entity_id: string, file_name: string) {
  const safe = file_name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${entity_type}/${entity_id}/${crypto.randomUUID()}-${safe}`;
}

export async function uploadAttachment(entity_type: string, entity_id: string, file: File) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error("Not signed in");
  const path = buildAttachmentPath(entity_type, entity_id, file.name);
  const up = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (up.error) throw up.error;
  const { error } = await supabase.from("ws_attachments").insert({
    entity_type,
    entity_id,
    file_name: file.name,
    file_path: path,
    content_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: uid,
  });
  if (error) {
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove([path]);
    throw error;
  }
}

export async function getAttachmentUrl(file_path: string) {
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(file_path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteAttachment(id: string, file_path: string) {
  await supabase.storage.from(ATTACHMENTS_BUCKET).remove([file_path]);
  const { error } = await supabase.from("ws_attachments").delete().eq("id", id);
  if (error) throw error;
}

export function formatBytes(n: number | null | undefined) {
  if (!n || n <= 0) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}