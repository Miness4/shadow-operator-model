/**
 * Database types for Supabase
 * These will be auto-generated in production using:
 * npx supabase gen types typescript --linked > types/database.ts
 *
 * For now, this provides the structure for type safety
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferred_model: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_model?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_model?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creators: {
        Row: {
          id: string;
          user_id: string;
          instagram_handle: string | null;
          youtube_url: string | null;
          name: string | null;
          bio: string | null;
          profile_picture_url: string | null;
          follower_count: number | null;
          following_count: number | null;
          post_count: number | null;
          engagement_rate: number | null;
          profile_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          instagram_handle?: string | null;
          youtube_url?: string | null;
          name?: string | null;
          bio?: string | null;
          profile_picture_url?: string | null;
          follower_count?: number | null;
          following_count?: number | null;
          post_count?: number | null;
          engagement_rate?: number | null;
          profile_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          instagram_handle?: string | null;
          youtube_url?: string | null;
          name?: string | null;
          bio?: string | null;
          profile_picture_url?: string | null;
          follower_count?: number | null;
          following_count?: number | null;
          post_count?: number | null;
          engagement_rate?: number | null;
          profile_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creator_dna: {
        Row: {
          id: string;
          creator_id: string;
          niche: string | null;
          audience_pain_points: Json | null;
          creator_archetype: string | null;
          tone_of_voice: string | null;
          content_frequency: string | null;
          current_monetization: number | null;
          potential_income: number | null;
          desperation_score: number | null;
          recommended_product_type: string | null;
          raw_analysis: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          niche?: string | null;
          audience_pain_points?: Json | null;
          creator_archetype?: string | null;
          tone_of_voice?: string | null;
          content_frequency?: string | null;
          current_monetization?: number | null;
          potential_income?: number | null;
          desperation_score?: number | null;
          recommended_product_type?: string | null;
          raw_analysis?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          niche?: string | null;
          audience_pain_points?: Json | null;
          creator_archetype?: string | null;
          tone_of_voice?: string | null;
          content_frequency?: string | null;
          current_monetization?: number | null;
          potential_income?: number | null;
          desperation_score?: number | null;
          recommended_product_type?: string | null;
          raw_analysis?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gameplans: {
        Row: {
          id: string;
          creator_id: string;
          user_id: string;
          uvz_data: Json | null;
          revenue_projections: Json | null;
          product_recommendation: Json | null;
          curriculum: Json | null;
          pitch_deck_url: string | null;
          status: string;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          user_id: string;
          uvz_data?: Json | null;
          revenue_projections?: Json | null;
          product_recommendation?: Json | null;
          curriculum?: Json | null;
          pitch_deck_url?: string | null;
          status?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          user_id?: string;
          uvz_data?: Json | null;
          revenue_projections?: Json | null;
          product_recommendation?: Json | null;
          curriculum?: Json | null;
          pitch_deck_url?: string | null;
          status?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campaign_dna: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          author_bio: string | null;
          brand_voice: Json | null;
          icp: Json | null;
          buying_psychology: Json | null;
          offer_details: Json | null;
          voice_model: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          author_bio?: string | null;
          brand_voice?: Json | null;
          icp?: Json | null;
          buying_psychology?: Json | null;
          offer_details?: Json | null;
          voice_model?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          author_bio?: string | null;
          brand_voice?: Json | null;
          icp?: Json | null;
          buying_psychology?: Json | null;
          offer_details?: Json | null;
          voice_model?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          campaign_dna_id: string | null;
          agent_type: string;
          input_context: Json | null;
          output_content: string | null;
          model_used: string | null;
          tokens_used: number | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          campaign_dna_id?: string | null;
          agent_type: string;
          input_context?: Json | null;
          output_content?: string | null;
          model_used?: string | null;
          tokens_used?: number | null;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          campaign_dna_id?: string | null;
          agent_type?: string;
          input_context?: Json | null;
          output_content?: string | null;
          model_used?: string | null;
          tokens_used?: number | null;
          rating?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          instagram_handle: string | null;
          name: string | null;
          profile_url: string | null;
          profile_picture_url: string | null;
          follower_count: number | null;
          engagement_rate: number | null;
          niche: string | null;
          status: string;
          reached_out_at: string | null;
          last_contacted_at: string | null;
          notes: string | null;
          tags: string[] | null;
          creator_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          instagram_handle?: string | null;
          name?: string | null;
          profile_url?: string | null;
          profile_picture_url?: string | null;
          follower_count?: number | null;
          engagement_rate?: number | null;
          niche?: string | null;
          status?: string;
          reached_out_at?: string | null;
          last_contacted_at?: string | null;
          notes?: string | null;
          tags?: string[] | null;
          creator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          instagram_handle?: string | null;
          name?: string | null;
          profile_url?: string | null;
          profile_picture_url?: string | null;
          follower_count?: number | null;
          engagement_rate?: number | null;
          niche?: string | null;
          status?: string;
          reached_out_at?: string | null;
          last_contacted_at?: string | null;
          notes?: string | null;
          tags?: string[] | null;
          creator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      interactions: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          type: string;
          content: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          type: string;
          content?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          user_id?: string;
          type?: string;
          content?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          due_at: string;
          message: string | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          due_at: string;
          message?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          user_id?: string;
          due_at?: string;
          message?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      niche_database: {
        Row: {
          id: string;
          niche_name: string;
          archetype_ideal: string | null;
          product_type_recommended: string | null;
          avg_price_point: number | null;
          competition_level: string | null;
          saturation_score: number | null;
          monetization_difficulty: number | null;
          profitability_score: number | null;
          growth_trajectory: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          niche_name: string;
          archetype_ideal?: string | null;
          product_type_recommended?: string | null;
          avg_price_point?: number | null;
          competition_level?: string | null;
          saturation_score?: number | null;
          monetization_difficulty?: number | null;
          profitability_score?: number | null;
          growth_trajectory?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          niche_name?: string;
          archetype_ideal?: string | null;
          product_type_recommended?: string | null;
          avg_price_point?: number | null;
          competition_level?: string | null;
          saturation_score?: number | null;
          monetization_difficulty?: number | null;
          profitability_score?: number | null;
          growth_trajectory?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
