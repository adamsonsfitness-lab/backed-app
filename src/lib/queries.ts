import { supabase } from '@/lib/supabase';
import type {
  Citation,
  Exercise,
  ExerciseWithCitations,
  Principle,
  PrincipleWithCitations,
  Workout,
  WorkoutSetWithExercise,
} from '@/types/database';

type CitationJoinRow<TKey extends string> = {
  [key in TKey]: Citation | Citation[] | null;
};

function flattenCitations<TKey extends string>(rows: CitationJoinRow<TKey>[], key: TKey): Citation[] {
  return rows
    .map((row) => row[key])
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []));
}

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercises').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getExercise(id: string): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getExerciseWithCitations(id: string): Promise<ExerciseWithCitations> {
  const { data: exercise, error: exerciseError } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single();
  if (exerciseError) throw exerciseError;

  const { data: joinRows, error: citationsError } = await supabase
    .from('exercise_citations')
    .select('citations(*)')
    .eq('exercise_id', id);
  if (citationsError) throw citationsError;

  return { ...exercise, citations: flattenCitations(joinRows ?? [], 'citations') };
}

export async function getPrinciples(): Promise<Principle[]> {
  const { data, error } = await supabase.from('principles').select('*').order('title');
  if (error) throw error;
  return data ?? [];
}

export async function getPrincipleWithCitations(id: string): Promise<PrincipleWithCitations> {
  const { data: principle, error: principleError } = await supabase
    .from('principles')
    .select('*')
    .eq('id', id)
    .single();
  if (principleError) throw principleError;

  const { data: joinRows, error: citationsError } = await supabase
    .from('principle_citations')
    .select('citations(*)')
    .eq('principle_id', id);
  if (citationsError) throw citationsError;

  return { ...principle, citations: flattenCitations(joinRows ?? [], 'citations') };
}

export async function getActiveWorkout(userId: string): Promise<Workout | null> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .is('finished_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function startWorkout(userId: string): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .insert({ user_id: userId, started_at: new Date().toISOString() })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function finishWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .update({ finished_at: new Date().toISOString() })
    .eq('id', workoutId);
  if (error) throw error;
}

export async function discardWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', workoutId);
  if (error) throw error;
}

export async function getWorkoutSets(workoutId: string): Promise<WorkoutSetWithExercise[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*, exercise:exercises(*)')
    .eq('workout_id', workoutId)
    .order('set_number');
  if (error) throw error;
  return data ?? [];
}

export async function addWorkoutSet(input: {
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
}): Promise<void> {
  const { error } = await supabase.from('workout_sets').insert({
    workout_id: input.workoutId,
    exercise_id: input.exerciseId,
    set_number: input.setNumber,
    reps: input.reps,
    weight_kg: input.weightKg,
    rpe: input.rpe,
  });
  if (error) throw error;
}

export async function deleteWorkoutSet(setId: string): Promise<void> {
  const { error } = await supabase.from('workout_sets').delete().eq('id', setId);
  if (error) throw error;
}

export async function getWorkoutHistory(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getWorkout(workoutId: string): Promise<Workout> {
  const { data, error } = await supabase.from('workouts').select('*').eq('id', workoutId).single();
  if (error) throw error;
  return data;
}
