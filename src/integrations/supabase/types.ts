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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_photo_url: string | null
          id: string
          painting_id: string
          painting_image: string
          painting_price: number
          painting_title: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_photo_url?: string | null
          id?: string
          painting_id: string
          painting_image: string
          painting_price: number
          painting_title: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customer_photo_url?: string | null
          id?: string
          painting_id?: string
          painting_image?: string
          painting_price?: number
          painting_title?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      paintings: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          dimensions: string
          id: string
          image_url: string
          medium: string
          original_price: number | null
          price: number
          sold: boolean
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          dimensions?: string
          id?: string
          image_url: string
          medium?: string
          original_price?: number | null
          price: number
          sold?: boolean
          title: string
          updated_at?: string
          year?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          dimensions?: string
          id?: string
          image_url?: string
          medium?: string
          original_price?: number | null
          price?: number
          sold?: boolean
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      paintings_3d: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          key: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          key: string
          section: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          key?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      upcoming_project_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          media_url: string
          project_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          media_type?: string
          media_url: string
          project_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "upcoming_project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "upcoming_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      upcoming_projects: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
