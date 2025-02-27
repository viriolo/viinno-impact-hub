
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
  current_amount: number | null
  description: string | null
  goal_amount: number | null
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
  current_amount?: number | null
  description?: string | null
  goal_amount?: number | null
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
  current_amount?: number | null
  description?: string | null
  goal_amount?: number | null
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
  bio: string | null
  location: string | null
  website: string | null
  academic_background: string | null
  social_links: Json | null
  organization_name: string | null
  organization_type: string | null
  organization_description: string | null
  skills: string[] | null
  interests: string[] | null
  expertise_areas: string[] | null
  availability: Json | null
  profile_completion_status: Json | null
  mentor_expertise: string[] | null
  csr_focus_areas: string[] | null
  ngo_expertise_areas: string[] | null
  project_collaborations: Json | null
  impact_metrics: Json | null
  mentor_availability: Json | null
  mentor_years_experience: number | null
  mentor_languages: Json | null
  mentor_education: Json | null
  mentor_achievements: Json | null
  mentor_testimonials: Json | null
  mentor_stats: Json | null
  mentor_preferences: Json | null
}

interface ProfileInsert {
  avatar_url?: string | null
  id: string
  updated_at?: string | null
  username?: string | null
  professional_background?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  academic_background?: string | null
  social_links?: Json | null
  organization_name?: string | null
  organization_type?: string | null
  organization_description?: string | null
  skills?: string[] | null
  interests?: string[] | null
  expertise_areas?: string[] | null
  availability?: Json | null
  profile_completion_status?: Json | null
  mentor_expertise?: string[] | null
  csr_focus_areas?: string[] | null
  ngo_expertise_areas?: string[] | null
  project_collaborations?: Json | null
  impact_metrics?: Json | null
  mentor_availability?: Json | null
  mentor_years_experience?: number | null
  mentor_languages?: Json | null
  mentor_education?: Json | null
  mentor_achievements?: Json | null
  mentor_testimonials?: Json | null
  mentor_stats?: Json | null
  mentor_preferences?: Json | null
}

interface ProfileUpdate {
  avatar_url?: string | null
  id?: string
  updated_at?: string | null
  username?: string | null
  professional_background?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  academic_background?: string | null
  social_links?: Json | null
  organization_name?: string | null
  organization_type?: string | null
  organization_description?: string | null
  skills?: string[] | null
  interests?: string[] | null
  expertise_areas?: string[] | null
  availability?: Json | null
  profile_completion_status?: Json | null
  mentor_expertise?: string[] | null
  csr_focus_areas?: string[] | null
  ngo_expertise_areas?: string[] | null
  project_collaborations?: Json | null
  impact_metrics?: Json | null
  mentor_availability?: Json | null
  mentor_years_experience?: number | null
  mentor_languages?: Json | null
  mentor_education?: Json | null
  mentor_achievements?: Json | null
  mentor_testimonials?: Json | null
  mentor_stats?: Json | null
  mentor_preferences?: Json | null
}
