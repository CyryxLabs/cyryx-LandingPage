
# Cyryx Command Workspace — plano de implementação

O PRD descreve um sistema operacional interno completo (15 módulos, permissões, IA-ready, MVP/V1.5/V2). A base já existe: schema novo (CRM, PM, HR, Finance), auth `@cyryxlabs.com`, admin, kanban, DataTables. Faltam os pontos que você listou nas últimas mensagens. Proponho entregar em 5 fases pequenas e testáveis, cada uma independente.

## Fase 1 — Drawer universal (deals, tarefas, candidatos)
- Componente `RecordDrawer` (Sheet lateral, design system Cyryx: `--onyx`, `--accent-glow`, glass panel).
- Abas: **Overview** (campos editáveis) · **Comments** · **Attachments** · **Watchers** · **Activity**.
- Comentários em `ws_comments` (polimórfico `entity_type` + `entity_id`).
- Watchers em `pm_task_watchers` para tasks; para deals/candidatos, estender `ws_watchers` genérico (migration curta).
- Activity log lê `ws_activity_log`; triggers já registram INSERT/UPDATE/DELETE nas tabelas principais.
- Integração: linhas dos DataTables e cards do kanban abrem o drawer no clique.

## Fase 2 — Notificações reais no header
- `NotificationsBell` no `WorkspaceShell` (badge + dropdown glass).
- Query em `ws_notifications` (unread first, top 20).
- Realtime via `supabase.channel('ws_notifications').on('postgres_changes', filter: user_id=me)`.
- Ações: marcar lida, marcar todas, deep-link para entidade.
- Triggers de servidor: novo comentário → notifica watchers; atribuição de task → notifica assignee.

## Fase 3 — Storage e anexos
- Bucket **workspace-attachments** (privado) via `storage_create_bucket`.
- RLS em `storage.objects`: `authenticated` pode `SELECT/INSERT/DELETE` quando `bucket_id='workspace-attachments'` (path próprio) e admin acessa tudo.
- Uso na tabela `ws_attachments` (já existe): guarda `bucket_path`, `file_name`, `size`, `mime`, `uploaded_by`.
- UI: aba Attachments do drawer com upload drag-and-drop + preview + signed URL para download.

## Fase 4 — Módulo Marketing (campanhas, canais, attribution)
- Migration:
  - `mkt_channels` (name, kind: paid/organic/referral/outbound, active)
  - `mkt_campaigns` (name, channel_id, status, start_at, end_at, budget, spend, goal)
  - `mkt_leads` (source_campaign_id, contact_id → `crm_contacts`, deal_id → `crm_deals`, first_touch_at, converted_at)
- Rota `/workspace/marketing`: tabs Campanhas · Canais · Attribution.
- Attribution: view materializada juntando `mkt_leads` × `crm_deals` (first-touch e last-touch, MRR gerado).

## Fase 5 — Dashboards por departamento
- Charts com `recharts` (leve, já compatível).
- **Overview**: MRR trend, receita 90d, pipeline value por stage, tasks concluídas/semana.
- **CRM**: pipeline por stage, win rate, ciclo médio (dias).
- **Dev**: throughput (tasks done/semana), burn-down de sprint ativo, tasks por status.
- **HR**: candidatos por stage, tempo médio contratação, headcount por depto.
- **Finance**: MRR/ARR, burn, runway, receita vs despesa (12m).
- **Marketing**: CAC por canal, leads → deals, ROI campanha.

## Detalhes técnicos

**Novas migrations**
- `ws_watchers` (polimórfico) + RLS.
- Bucket `workspace-attachments` + policies em `storage.objects`.
- Tabelas `mkt_channels`, `mkt_campaigns`, `mkt_leads` + RLS + triggers `updated_at`.
- Trigger `notify_watchers_on_comment()` insere em `ws_notifications`.
- Trigger `notify_assignee_on_task_change()` idem.
- View `mkt_attribution_v` (first/last touch).

**Frontend**
- `src/components/cyryx/workspace/drawer/RecordDrawer.tsx` + subcomponents (`CommentsPane`, `AttachmentsPane`, `WatchersPane`, `ActivityPane`).
- `src/components/cyryx/workspace/NotificationsBell.tsx` (montado no `WorkspaceShell`).
- `src/lib/attachments.ts` (helpers signed URL / upload).
- `src/routes/_authenticated/workspace.marketing.tsx` substituído (deixa de ser stub).
- `src/components/cyryx/workspace/charts/*` (`MRRChart`, `PipelineFunnel`, `Throughput`, etc.).

**Server functions**
- `workspace-drawer.functions.ts`: `getRecord`, `postComment`, `toggleWatcher`, `listActivity`.
- `attachments.functions.ts`: `createSignedUpload`, `listAttachments`, `deleteAttachment`.
- `notifications.functions.ts`: `listNotifications`, `markRead`, `markAllRead`.
- `marketing.functions.ts`: CRUD leve + attribution rollup.
- `dashboards.functions.ts`: agregações server-side por depto e janela `w`.

**Design system**
- Reutiliza `WorkspaceCard`, `WsButton`, `WsInput`, `HudLabel`, `GlassPanel`, `cx-liquid-glass`, tokens `--accent-glow` / `--silver`. Sem cores hardcoded.

## Ordem de execução

Recomendo entregar **uma fase por turno** (nesta ordem) — cada uma toca <10 arquivos, tem migração aprovável separada e mantém build verde:

```text
1. Fase 1: Drawer universal + comments/watchers/activity
2. Fase 2: Notificações realtime
3. Fase 3: Storage bucket + anexos
4. Fase 4: Módulo Marketing
5. Fase 5: Dashboards por departamento
```

Confirme se essa ordem serve, ou reordene. Assim que aprovar, começo pela **Fase 1**.
