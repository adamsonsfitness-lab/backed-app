/**
 * Hand-written mirror of the Supabase schema described in the project spec.
 * Replace with the real output of:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * once the Supabase CLI is available, to stay in sync with the live schema.
 */

export type Category = 'compound' | 'isolation';

export interface Database {
  public: {
    Tables: {
      citations: {
        Row: {
          id: string;
          authors: string;
          year: number;
          title: string;
          journal: string;
          details: string | null;
          summary: string | null;
        };
        Insert: Partial<Database['public']['Tables']['citations']['Row']>;
        Update: Partial<Database['public']['Tables']['citations']['Row']>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          category: Category;
          muscle_group: string;
          secondary_muscles: string[] | null;
          equipment: string;
          default_sets: number;
          default_reps: number;
          default_rest_seconds: number;
          why: string;
        };
        Insert: Partial<Database['public']['Tables']['exercises']['Row']>;
        Update: Partial<Database['public']['Tables']['exercises']['Row']>;
        Relationships: [];
      };
      exercise_citations: {
        Row: {
          exercise_id: string;
          citation_id: string;
        };
        Insert: Database['public']['Tables']['exercise_citations']['Row'];
        Update: Partial<Database['public']['Tables']['exercise_citations']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'exercise_citations_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_citations_citation_id_fkey';
            columns: ['citation_id'];
            isOneToOne: false;
            referencedRelation: 'citations';
            referencedColumns: ['id'];
          },
        ];
      };
      principles: {
        Row: {
          id: string;
          title: string;
          short_answer: string;
          explanation: string;
        };
        Insert: Partial<Database['public']['Tables']['principles']['Row']>;
        Update: Partial<Database['public']['Tables']['principles']['Row']>;
        Relationships: [];
      };
      principle_citations: {
        Row: {
          principle_id: string;
          citation_id: string;
        };
        Insert: Database['public']['Tables']['principle_citations']['Row'];
        Update: Partial<Database['public']['Tables']['principle_citations']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'principle_citations_principle_id_fkey';
            columns: ['principle_id'];
            isOneToOne: false;
            referencedRelation: 'principles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'principle_citations_citation_id_fkey';
            columns: ['citation_id'];
            isOneToOne: false;
            referencedRelation: 'citations';
            referencedColumns: ['id'];
          },
        ];
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          finished_at: string | null;
          notes: string | null;
        };
        Insert: Partial<Database['public']['Tables']['workouts']['Row']> & {
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['workouts']['Row']>;
        Relationships: [];
      };
      workout_sets: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          set_number: number;
          reps: number | null;
          weight_kg: number | null;
          rpe: number | null;
        };
        Insert: Partial<Database['public']['Tables']['workout_sets']['Row']> & {
          workout_id: string;
          exercise_id: string;
          set_number: number;
        };
        Update: Partial<Database['public']['Tables']['workout_sets']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'workout_sets_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workout_sets_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Citation = Database['public']['Tables']['citations']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type Principle = Database['public']['Tables']['principles']['Row'];
export type Workout = Database['public']['Tables']['workouts']['Row'];
export type WorkoutSet = Database['public']['Tables']['workout_sets']['Row'];

export type ExerciseWithCitations = Exercise & { citations: Citation[] };
export type PrincipleWithCitations = Principle & { citations: Citation[] };
export type WorkoutSetWithExercise = WorkoutSet & { exercise: Exercise };
