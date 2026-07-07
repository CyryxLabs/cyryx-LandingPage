import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceCard, WsButton, WsInput, WsSelect } from "./WorkspaceShell";
import { useState } from "react";
import { drawerStore } from "@/lib/drawer-store";
import { PanelRightOpen } from "lucide-react";

type FieldType = "text" | "number" | "select" | "date";
export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  className?: string;
  format?: (v: any) => string;
  editable?: boolean; // default true
};

export function DataTable({
  tableName,
  queryKey,
  fields,
  orderBy = "updated_at",
  ascending = false,
  emptyHint = "No records yet.",
}: {
  tableName: string;
  queryKey: string;
  fields: FieldDef[];
  orderBy?: string;
  ascending?: boolean;
  emptyHint?: string;
}) {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(tableName).select("*").order(orderBy, { ascending });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [draft, setDraft] = useState<Record<string, any>>({});

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const row: Record<string, any> = {};
    for (const f of fields) {
      const v = draft[f.key];
      if (v === undefined || v === "") continue;
      row[f.key] = f.type === "number" ? Number(v) : v;
    }
    if (fields.some((f) => f.required && !row[f.key])) return;
    const { error } = await (supabase as any).from(tableName).insert(row);
    if (error) { alert(error.message); return; }
    setDraft({});
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  async function update(id: string, key: string, val: any) {
    const field = fields.find((f) => f.key === key);
    const value = field?.type === "number" ? Number(val) : val;
    await (supabase as any).from(tableName).update({ [key]: value }).eq("id", id);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this row?")) return;
    await (supabase as any).from(tableName).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  return (
    <div>
      <form onSubmit={add} className="flex flex-wrap gap-2 mb-6 items-center">
        {fields.map((f) => renderInput(f, draft[f.key] ?? "", (v) => setDraft({ ...draft, [f.key]: v }), true))}
        <WsButton type="submit" variant="primary">Add</WsButton>
      </form>

      {isLoading && <p className="text-sm text-[var(--silver-dim)]">Loading…</p>}

      <WorkspaceCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--silver-dim)] border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
                {fields.map((f) => <th key={f.key} className="px-3 py-2">{f.label}</th>)}
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && !isLoading && (
                <tr><td colSpan={fields.length + 1} className="px-3 py-8 text-center text-[var(--silver-dim)] text-xs">{emptyHint}</td></tr>
              )}
              {data.map((row: any) => (
                <tr key={row.id} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]">
                  {fields.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                      {f.editable === false
                        ? <span className="text-[var(--silver-dim)]">{f.format ? f.format(row[f.key]) : (row[f.key] ?? "—")}</span>
                        : renderInput(f, row[f.key] ?? "", (v) => update(row.id, f.key, v), false)}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => drawerStore.open({ entity_type: tableName, entity_id: row.id })}
                      className="text-[var(--silver-dim)] hover:text-[var(--accent-glow)] px-1.5"
                      aria-label="Open details"
                      title="Open details"
                    >
                      <PanelRightOpen className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => remove(row.id)}
                      className="text-[var(--silver-dim)] hover:text-red-400 text-xs px-1.5"
                      aria-label="Delete"
                    >×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspaceCard>
    </div>
  );
}

function renderInput(
  f: FieldDef,
  value: any,
  onChange: (v: any) => void,
  isNew: boolean,
) {
  const width = f.className ?? (f.type === "number" ? "w-28" : "min-w-[140px]");
  if (f.type === "select") {
    return (
      <WsSelect
        key={f.key}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={width}
        aria-label={f.label}
      >
        {isNew && <option value="">{f.label}…</option>}
        {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
      </WsSelect>
    );
  }
  return (
    <WsInput
      key={f.key}
      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isNew ? f.label : ""}
      required={isNew && f.required}
      className={width}
      aria-label={f.label}
    />
  );
}
