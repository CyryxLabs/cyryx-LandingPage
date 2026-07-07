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
      crm_activities: {
        Row: {
          body: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          due_at: string | null
          id: string
          kind: string
          owner_id: string | null
          subject: string
        }
        Insert: {
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          due_at?: string | null
          id?: string
          kind: string
          owner_id?: string | null
          subject: string
        }
        Update: {
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          due_at?: string | null
          id?: string
          kind?: string
          owner_id?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          owner_id: string | null
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          company_id: string | null
          contact_id: string | null
          created_at: string
          currency: string
          expected_close_date: string | null
          id: string
          notes: string | null
          owner_id: string | null
          pipeline_id: string
          position: number
          source: string | null
          stage_id: string
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          pipeline_id: string
          position?: number
          source?: string | null
          stage_id: string
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          pipeline_id?: string
          position?: number
          source?: string | null
          stage_id?: string
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
        }
        Relationships: []
      }
      crm_stages: {
        Row: {
          created_at: string
          id: string
          is_lost: boolean
          is_won: boolean
          name: string
          pipeline_id: string
          position: number
          probability: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_lost?: boolean
          is_won?: boolean
          name: string
          pipeline_id: string
          position?: number
          probability?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_lost?: boolean
          is_won?: boolean
          name?: string
          pipeline_id?: string
          position?: number
          probability?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
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
      fin_accounts: {
        Row: {
          created_at: string
          currency: string
          id: string
          kind: string
          name: string
          opening_balance: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          kind: string
          name: string
          opening_balance?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          name?: string
          opening_balance?: number | null
        }
        Relationships: []
      }
      fin_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          kind: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          kind: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      fin_invoices: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string
          currency: string
          customer_name: string
          due_at: string | null
          id: string
          issued_at: string | null
          notes: string | null
          number: string
          paid_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string
          currency?: string
          customer_name: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          number: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string
          currency?: string
          customer_name?: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          number?: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_subscriptions: {
        Row: {
          canceled_at: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          currency: string
          customer_name: string
          id: string
          mrr: number
          plan: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          customer_name: string
          id?: string
          mrr?: number
          plan?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          customer_name?: string
          id?: string
          mrr?: number
          plan?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fin_subscriptions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_transactions: {
        Row: {
          account_id: string | null
          amount: number
          attachment_url: string | null
          category_id: string | null
          counterparty: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          id: string
          kind: string
          occurred_on: string
          reference: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          attachment_url?: string | null
          category_id?: string | null
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          kind: string
          occurred_on: string
          reference?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          attachment_url?: string | null
          category_id?: string | null
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          kind?: string
          occurred_on?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fin_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fin_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fin_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "fin_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_candidates: {
        Row: {
          applied_at: string
          email: string | null
          full_name: string
          id: string
          job_id: string | null
          linkedin_url: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          rating: number | null
          resume_url: string | null
          source: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          email?: string | null
          full_name: string
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          resume_url?: string | null
          source?: string | null
          stage?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          email?: string | null
          full_name?: string
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          resume_url?: string | null
          source?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "hr_job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_departments: {
        Row: {
          created_at: string
          head_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          head_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          head_id?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      hr_employees: {
        Row: {
          created_at: string
          department_id: string | null
          email: string
          employment_type: string | null
          end_date: string | null
          full_name: string
          id: string
          location: string | null
          manager_id: string | null
          phone: string | null
          salary: number | null
          salary_currency: string | null
          start_date: string | null
          status: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email: string
          employment_type?: string | null
          end_date?: string | null
          full_name: string
          id?: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          salary?: number | null
          salary_currency?: string | null
          start_date?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string
          employment_type?: string | null
          end_date?: string | null
          full_name?: string
          id?: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          salary?: number | null
          salary_currency?: string | null
          start_date?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_job_openings: {
        Row: {
          closed_at: string | null
          created_at: string
          department_id: string | null
          description: string | null
          employment_type: string | null
          hiring_manager_id: string | null
          id: string
          location: string | null
          posted_at: string | null
          salary_max: number | null
          salary_min: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          employment_type?: string | null
          hiring_manager_id?: string | null
          id?: string
          location?: string | null
          posted_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          employment_type?: string | null
          hiring_manager_id?: string | null
          id?: string
          location?: string | null
          posted_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_job_openings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_reviews: {
        Row: {
          created_at: string
          employee_id: string
          goals: string | null
          growth_areas: string | null
          id: string
          period: string
          rating: number | null
          reviewer_id: string | null
          status: string
          strengths: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          goals?: string | null
          growth_areas?: string | null
          id?: string
          period: string
          rating?: number | null
          reviewer_id?: string | null
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          goals?: string | null
          growth_areas?: string | null
          id?: string
          period?: string
          rating?: number | null
          reviewer_id?: string | null
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_time_off: {
        Row: {
          approver_id: string | null
          created_at: string
          employee_id: string
          end_date: string
          id: string
          kind: string
          reason: string | null
          start_date: string
          status: string
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          kind: string
          reason?: string | null
          start_date: string
          status?: string
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          kind?: string
          reason?: string | null
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_time_off_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
        ]
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
      pm_projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          key: string
          lead_id: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key: string
          lead_id?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          lead_id?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pm_sprints: {
        Row: {
          created_at: string
          end_at: string | null
          goal: string | null
          id: string
          name: string
          project_id: string
          start_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          end_at?: string | null
          goal?: string | null
          id?: string
          name: string
          project_id: string
          start_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          end_at?: string | null
          goal?: string | null
          id?: string
          name?: string
          project_id?: string
          start_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pm_sprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "pm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_task_watchers: {
        Row: {
          created_at: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pm_task_watchers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "pm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_tasks: {
        Row: {
          assignee_id: string | null
          code: string | null
          created_at: string
          description: string | null
          due_at: string | null
          estimate_hours: number | null
          id: string
          labels: string[] | null
          parent_task_id: string | null
          position: number
          priority: string
          project_id: string
          reporter_id: string | null
          spent_hours: number | null
          sprint_id: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          estimate_hours?: number | null
          id?: string
          labels?: string[] | null
          parent_task_id?: string | null
          position?: number
          priority?: string
          project_id: string
          reporter_id?: string | null
          spent_hours?: number | null
          sprint_id?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          estimate_hours?: number | null
          id?: string
          labels?: string[] | null
          parent_task_id?: string | null
          position?: number
          priority?: string
          project_id?: string
          reporter_id?: string | null
          spent_hours?: number | null
          sprint_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pm_tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "pm_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "pm_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "pm_sprints"
            referencedColumns: ["id"]
          },
        ]
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
      workspace_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ws_activity_log: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      ws_attachments: {
        Row: {
          content_type: string | null
          created_at: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          id: string
          size_bytes: number | null
          uploaded_by: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          id?: string
          size_bytes?: number | null
          uploaded_by: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_path?: string
          id?: string
          size_bytes?: number | null
          uploaded_by?: string
        }
        Relationships: []
      }
      ws_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          edited_at: string | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          edited_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          edited_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      ws_notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: string
          read_at: string | null
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind: string
          read_at?: string | null
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          url?: string | null
          user_id?: string
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
