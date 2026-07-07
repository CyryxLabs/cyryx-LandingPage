export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          created_at: string
          email: string
          note: string | null
        }
        Insert: {
          created_at?: string
          email: string
          note?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          note?: string | null
        }
        Relationships: []
      }
      auth_domain_blocks: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          reason: string
          user_agent_hash: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          reason: string
          user_agent_hash?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          reason?: string
          user_agent_hash?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          consent_given_at: string
          created_at: string
          email: string
          handled_at: string | null
          id: string
          ip_hash: string | null
          message: string
          name: string
          notes: string | null
          user_agent_hash: string | null
        }
        Insert: {
          company?: string | null
          consent_given_at?: string
          created_at?: string
          email: string
          handled_at?: string | null
          id?: string
          ip_hash?: string | null
          message: string
          name: string
          notes?: string | null
          user_agent_hash?: string | null
        }
        Update: {
          company?: string | null
          consent_given_at?: string
          created_at?: string
          email?: string
          handled_at?: string | null
          id?: string
          ip_hash?: string | null
          message?: string
          name?: string
          notes?: string | null
          user_agent_hash?: string | null
        }
        Relationships: []
      }
      cta_events: {
        Row: {
          created_at: string
          cta: string
          href: string | null
          id: string
          path: string
          referrer: string | null
          section: string
          user_agent: string | null
          variant: string | null
        }
        Insert: {
          created_at?: string
          cta: string
          href?: string | null
          id?: string
          path: string
          referrer?: string | null
          section: string
          user_agent?: string | null
          variant?: string | null
        }
        Update: {
          created_at?: string
          cta?: string
          href?: string | null
          id?: string
          path?: string
          referrer?: string | null
          section?: string
          user_agent?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirm_token: string | null
          confirm_token_expires_at: string | null
          confirmed_at: string | null
          consent_given_at: string
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          status: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at: string | null
          updated_at: string
          user_agent_hash: string | null
        }
        Insert: {
          confirm_token?: string | null
          confirm_token_expires_at?: string | null
          confirmed_at?: string | null
          consent_given_at?: string
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent_hash?: string | null
        }
        Update: {
          confirm_token?: string | null
          confirm_token_expires_at?: string | null
          confirmed_at?: string | null
          consent_given_at?: string
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent_hash?: string | null
        }
        Relationships: []
      }
      rate_limit_events: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_hash: string
          ua_hash: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_hash: string
          ua_hash?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_hash?: string
          ua_hash?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      web_vitals: {
        Row: {
          created_at: string
          id: string
          low_perf: boolean
          metric_name: string
          metric_value: number
          nav_type: string | null
          path: string
          rating: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          low_perf?: boolean
          metric_name: string
          metric_value: number
          nav_type?: string | null
          path: string
          rating?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          low_perf?: boolean
          metric_name?: string
          metric_value?: number
          nav_type?: string | null
          path?: string
          rating?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ws_campaigns: {
        Row: {
          budget_usd: number | null
          channel: string | null
          created_at: string
          id: string
          leads: number | null
          name: string
          notes: string | null
          spent_usd: number | null
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
        }
        Insert: {
          budget_usd?: number | null
          channel?: string | null
          created_at?: string
          id?: string
          leads?: number | null
          name: string
          notes?: string | null
          spent_usd?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Update: {
          budget_usd?: number | null
          channel?: string | null
          created_at?: string
          id?: string
          leads?: number | null
          name?: string
          notes?: string | null
          spent_usd?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Relationships: []
      }
      ws_candidates: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          role: string | null
          source: string | null
          stage: Database["public"]["Enums"]["candidate_stage"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          role?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["candidate_stage"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          role?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["candidate_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      ws_deals: {
        Row: {
          company: string | null
          contact_email: string | null
          created_at: string
          expected_close_date: string | null
          id: string
          notes: string | null
          owner_email: string | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
          value_usd: number | null
        }
        Insert: {
          company?: string | null
          contact_email?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          owner_email?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
          value_usd?: number | null
        }
        Update: {
          company?: string | null
          contact_email?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          owner_email?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
          value_usd?: number | null
        }
        Relationships: []
      }
      ws_dev_tasks: {
        Row: {
          assignee_email: string | null
          created_at: string
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          product_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_email?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          product_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_email?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          product_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ws_dev_tasks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "ws_products"
            referencedColumns: ["id"]
          },
        ]
      }
      ws_finance_metrics: {
        Row: {
          cash_usd: number | null
          created_at: string
          expenses_usd: number | null
          id: string
          month: string
          mrr_usd: number | null
          new_revenue_usd: number | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          cash_usd?: number | null
          created_at?: string
          expenses_usd?: number | null
          id?: string
          month: string
          mrr_usd?: number | null
          new_revenue_usd?: number | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          cash_usd?: number | null
          created_at?: string
          expenses_usd?: number | null
          id?: string
          month?: string
          mrr_usd?: number | null
          new_revenue_usd?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ws_products: {
        Row: {
          created_at: string
          description: string | null
          health: number | null
          id: string
          name: string
          owner_email: string | null
          roadmap_note: string | null
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          health?: number | null
          id?: string
          name: string
          owner_email?: string | null
          roadmap_note?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          health?: number | null
          id?: string
          name?: string
          owner_email?: string | null
          roadmap_note?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      campaign_status: "planned" | "running" | "paused" | "completed"
      candidate_stage:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      deal_stage:
        | "lead"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
      newsletter_status: "pending" | "confirmed" | "unsubscribed"
      product_status: "idea" | "building" | "beta" | "live" | "sunset"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "backlog" | "todo" | "in_progress" | "review" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      campaign_status: ["planned", "running", "paused", "completed"],
      candidate_stage: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      deal_stage: [
        "lead",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ],
      newsletter_status: ["pending", "confirmed", "unsubscribed"],
      product_status: ["idea", "building", "beta", "live", "sunset"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["backlog", "todo", "in_progress", "review", "done"],
    },
  },
} as const
