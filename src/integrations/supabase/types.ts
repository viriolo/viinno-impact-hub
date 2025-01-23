export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      impact_cards: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          media_url: string | null
          metrics: Json | null
          shares: number | null
          status: Database["public"]["Enums"]["card_status"] | null
          title: string
          updated_at: string
          user_id: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          media_url?: string | null
          metrics?: Json | null
          shares?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          title: string
          updated_at?: string
          user_id?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          media_url?: string | null
          metrics?: Json | null
          shares?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          title?: string
          updated_at?: string
          user_id?: string | null
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_background: string | null
          availability: Json | null
          avatar_url: string | null
          bio: string | null
          expertise_areas: string[] | null
          id: string
          interests: string[] | null
          location: string | null
          organization_description: string | null
          organization_name: string | null
          organization_type: string | null
          professional_background: string | null
          profile_completion_status: Json | null
          skills: string[] | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          academic_background?: string | null
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          expertise_areas?: string[] | null
          id: string
          interests?: string[] | null
          location?: string | null
          organization_description?: string | null
          organization_name?: string | null
          organization_type?: string | null
          professional_background?: string | null
          profile_completion_status?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          academic_background?: string | null
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          expertise_areas?: string[] | null
          id?: string
          interests?: string[] | null
          location?: string | null
          organization_description?: string | null
          organization_name?: string | null
          organization_type?: string | null
          professional_background?: string | null
          profile_completion_status?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          content_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
          views: number | null
        }
        Insert: {
          category?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          views?: number | null
        }
        Update: {
          category?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_profile_completion: {
        Args: {
          profile_data: unknown
        }
        Returns: number
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "scholar" | "mentor" | "csr_funder" | "ngo"
      card_status: "draft" | "published" | "archived"
      resource_type: "article" | "video" | "document" | "link"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
