import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getWorkout, getWorkoutSets } from '@/lib/queries';
import type { Workout, WorkoutSetWithExercise } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sets, setSets] = useState<WorkoutSetWithExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWorkout(id), getWorkoutSets(id)]).then(([workoutData, setsData]) => {
      setWorkout(workoutData);
      setSets(setsData);
      setLoading(false);
    });
  }, [id]);

  if (loading || !workout) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const groups = new Map<string, WorkoutSetWithExercise[]>();
  sets.forEach((set) => {
    const existing = groups.get(set.exercise_id) ?? [];
    existing.push(set);
    groups.set(set.exercise_id, existing);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.date}>
        {new Date(workout.started_at).toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      {Array.from(groups.entries()).map(([exerciseId, exerciseSets]) => (
        <View key={exerciseId} style={styles.card}>
          <Pressable onPress={() => router.push(`/(tabs)/learn/exercises/${exerciseId}`)}>
            <Text style={styles.exerciseName}>{exerciseSets[0].exercise.name}</Text>
          </Pressable>
          {exerciseSets
            .sort((a, b) => a.set_number - b.set_number)
            .map((set) => (
              <Text key={set.id} style={styles.setText}>
                Set {set.set_number}: {set.reps ?? '–'} reps
                {set.weight_kg ? ` @ ${set.weight_kg} kg` : ''}
                {set.rpe ? ` · RPE ${set.rpe}` : ''}
              </Text>
            ))}
        </View>
      ))}

      {workout.notes ? (
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.setText}>{workout.notes}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: spacing.lg,
  },
  date: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  setText: {
    fontSize: 14,
    color: colors.text,
    paddingVertical: 2,
  },
});
