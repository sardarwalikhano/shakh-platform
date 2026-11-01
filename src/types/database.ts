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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      catalog_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_ar: string | null
          name_ckb: string
          name_en: string | null
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_ckb: string
          name_en?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string | null
          name_ckb?: string
          name_en?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          compare_at_price_iqd: number | null
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          name: string
          price_iqd: number
          sku: string | null
          status: string
          stock_quantity: number | null
          store_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          compare_at_price_iqd?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          name: string
          price_iqd: number
          sku?: string | null
          status?: string
          stock_quantity?: number | null
          store_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          compare_at_price_iqd?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          name?: string
          price_iqd?: number
          sku?: string | null
          status?: string
          stock_quantity?: number | null
          store_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      merchant_applications: {
        Row: {
          address_line: string
          applicant_id: string
          business_name: string
          city: string
          contact_person: string
          created_at: string
          description: string | null
          district: string
          id: string
          merchant_category: string
          phone: string
          proposed_slug: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          store_id: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          address_line: string
          business_name: string
          city: string
          contact_person: string
          description?: string | null
          district: string
          merchant_category: string
          phone: string
          proposed_slug?: string | null
        }
        Update: {
          address_line?: string
          business_name?: string
          city?: string
          contact_person?: string
          description?: string | null
          district?: string
          merchant_category?: string
          phone?: string
          proposed_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_applications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address_line: string | null
          city: string | null
          contact_person: string | null
          district: string | null
          created_at: string
          description: string | null
          id: string
          is_platform_store: boolean
          logo_url: string | null
          merchant_category: string | null
          name: string
          owner_id: string | null
          phone: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          contact_person?: string | null
          district?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_platform_store?: boolean
          logo_url?: string | null
          merchant_category?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          contact_person?: string | null
          district?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_platform_store?: boolean
          logo_url?: string | null
          merchant_category?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
      store_moderation_events: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          new_status: string
          note: string
          previous_status: string
          store_id: string
        }
        Insert: {
          actor_id: string
          new_status: string
          note: string
          previous_status: string
          store_id: string
          created_at?: string
          id?: string
        }
        Update: {
          actor_id?: string
          new_status?: string
          note?: string
          previous_status?: string
          store_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_moderation_events_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_merchant_application: {
        Args: { p_application_id: string; p_review_note?: string | null; p_reviewer_id: string }
        Returns: { applicant_id: string; merchant_category: string; store_id: string }[]
      }
      current_app_role: { Args: never; Returns: string }
      moderate_merchant_store: {
        Args: { p_actor_id: string; p_new_status: string; p_note: string; p_store_id: string }
        Returns: { new_status: string; previous_status: string; store_id: string }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
