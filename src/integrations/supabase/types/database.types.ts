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
      impact_cards: {
        Row: ImpactCardRow
        Insert: ImpactCardInsert
        Update: ImpactCardUpdate
        Relationships: [
          {
            foreignKeyName: "impact_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
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
      card_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

interface ImpactCardRow {
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

interface ImpactCardInsert {
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

interface ImpactCardUpdate {
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

interface ProfileRow {
  avatar_url: string | null
  id: string
  updated_at: string | null
  username: string | null
  professional_background: string | null
}

interface ProfileInsert {
  avatar_url?: string | null
  id: string
  updated_at?: string | null
  username?: string | null
  professional_background?: string | null
}

interface ProfileUpdate {
  avatar_url?: string | null
  id?: string
  updated_at?: string | null
  username?: string | null
  professional_background?: string | null
}