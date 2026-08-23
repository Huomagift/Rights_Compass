export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          whatsapp_number: string | null;
          onboarding_status: 'in_progress' | 'completed';
          consent_status: boolean;
          consent_timestamp: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          whatsapp_number?: string | null;
          onboarding_status?: 'in_progress' | 'completed';
          consent_status?: boolean;
          consent_timestamp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          whatsapp_number?: string | null;
          onboarding_status?: 'in_progress' | 'completed';
          consent_status?: boolean;
          consent_timestamp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          profile_id: string;
          preferred_lesson_time: string;
          priority_rights: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          preferred_lesson_time: string;
          priority_rights: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          preferred_lesson_time?: string;
          priority_rights?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      constitutions: {
        Row: {
          id: string;
          title: string;
          year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          year?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          year?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      constitution_chapters: {
        Row: {
          id: string;
          constitution_id: string;
          chapter_number: string;
          title: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          constitution_id: string;
          chapter_number: string;
          title: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          constitution_id?: string;
          chapter_number?: string;
          title?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      constitution_sections: {
        Row: {
          id: string;
          constitution_id: string;
          chapter_id: string | null;
          section_number: string;
          title: string;
          full_text: string;
          display_order: number;
          source_reference: string | null;
          needs_manual_review: boolean;
          review_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          constitution_id: string;
          chapter_id?: string | null;
          section_number: string;
          title: string;
          full_text: string;
          display_order?: number;
          source_reference?: string | null;
          needs_manual_review?: boolean;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          constitution_id?: string;
          chapter_id?: string | null;
          section_number?: string;
          title?: string;
          full_text?: string;
          display_order?: number;
          source_reference?: string | null;
          needs_manual_review?: boolean;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rights_domains: {
        Row: {
          id: string;
          name: 'civil' | 'police' | 'tenancy' | 'employment' | 'consumer';
          description: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: 'civil' | 'police' | 'tenancy' | 'employment' | 'consumer';
          description?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: 'civil' | 'police' | 'tenancy' | 'employment' | 'consumer';
          description?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      guides: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          rights_domain_id: string | null;
          constitution_section_id: string | null;
          signoff_status: 'draft' | 'in_review' | 'approved' | 'retired';
          signoff_by: string | null;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content: string;
          rights_domain_id?: string | null;
          constitution_section_id?: string | null;
          signoff_status?: 'draft' | 'in_review' | 'approved' | 'retired';
          signoff_by?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: string;
          rights_domain_id?: string | null;
          constitution_section_id?: string | null;
          signoff_status?: 'draft' | 'in_review' | 'approved' | 'retired';
          signoff_by?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
