import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import {
  addWorkoutSet,
  deleteWorkoutSet,
  discardWorkout,
  finishWorkout,
  getActiveWorkout,
  getExercise,
  getWorkoutSets,
  startWorkout,
} from '@/lib/queries';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import type { Exercise, Workout, WorkoutSetWithExercise } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

interface SetInput {
  reps: string;
  weight: string;
  rpe: string;
}

export default function LogScreen() {
  const { session } = useAuth();
  const userId = session!.user.id;
  const params = useLocalSearchParams<{ addExerciseId?: string }>();

  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sets, setSets] = useState<WorkoutSetWithExercise[]>([]);
  const [exerciseById, setExerciseById] = useState<Record<string, Exercise>>({});
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, SetInput>>({});
  const [savingExerciseId, setSavingExerciseId] = useState<string | null>(null);

  const loadActiveWorkout = useCallback(async () => {
    setLoading(true);
    const active = await getActiveWorkout(userId);
    setWorkout(active);
    if (active) {
      const workoutSets = await getWorkoutSets(active.id);
      setSets(workoutSets);
      setExerciseById((prev) => {
        const next = { ...prev };
        workoutSets.forEach((set) => {
          next[set.exercise_id] = set.exercise;
        });
        return next;
      });
    } else {
      setSets([]);
      setPendingIds([]);
    }
    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadActiveWorkout();
    }, [loadActiveWorkout])
  );

  useEffect(() => {
    if (!params.addExerciseId) return;
    const exerciseId = params.addExerciseId;
    router.setParams({ addExerciseId: undefined });

    getExercise(exerciseId).then((exercise) => {
      setExerciseById((prev) => (prev[exerciseId] ? prev : { ...prev, [exerciseId]: exercise }));
      setPendingIds((prev) => (prev.includes(exerciseId) ? prev : [...prev, exerciseId]));
    });
  }, [params.addExerciseId]);

  async function handleStartWorkout() {
    setLoading(true);
    const created = await startWorkout(userId);
    setWorkout(created);
    setSets([]);
    setPendingIds([]);
    setLoading(false);
  }

  function confirmFinish() {
    Alert.alert('Finish workout?', 'This will mark the session complete.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Finish', onPress: handleFinish },
    ]);
  }

  async function handleFinish() {
    if (!workout) return;
    await finishWorkout(workout.id);
    setWorkout(null);
    setSets([]);
    setPendingIds([]);
    router.push('/(tabs)/history');
  }

  function confirmDiscard() {
    Alert.alert('Discard workout?', 'All logged sets in this session will be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: handleDiscard },
    ]);
  }

  async function handleDiscard() {
    if (!workout) return;
    await discardWorkout(workout.id);
    setWorkout(null);
    setSets([]);
    setPendingIds([]);
  }

  function updateInput(exerciseId: string, field: keyof SetInput, value: string) {
    setInputs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value } as SetInput,
    }));
  }

  async function handleAddSet(exerciseId: string) {
    if (!workout) return;
    const input = inputs[exerciseId] ?? { reps: '', weight: '', rpe: '' };
    const existingCount = sets.filter((set) => set.exercise_id === exerciseId).length;

    setSavingExerciseId(exerciseId);
    await addWorkoutSet({
      workoutId: workout.id,
      exerciseId,
      setNumber: existingCount + 1,
      reps: input.reps ? Number(input.reps) : null,
      weightKg: input.weight ? Number(input.weight) : null,
      rpe: input.rpe ? Number(input.rpe) : null,
    });
    const refreshed = await getWorkoutSets(workout.id);
    setSets(refreshed);
    setInputs((prev) => ({ ...prev, [exerciseId]: { reps: input.reps, weight: input.weight, rpe: '' } }));
    setSavingExerciseId(null);
  }

  async function handleDeleteSet(setId: string) {
    if (!workout) return;
    await deleteWorkoutSet(setId);
    const refreshed = await getWorkoutSets(workout.id);
    setSets(refreshed);
  }

  function removePendingExercise(exerciseId: string) {
    setPendingIds((prev) => prev.filter((id) => id !== exerciseId));
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyTitle}>No active workout</Text>
        <Text style={styles.emptySubtitle}>Start one to begin logging sets.</Text>
        <View style={{ marginTop: spacing.lg, width: '100%', paddingHorizontal: spacing.xl }}>
          <Button title="Start workout" onPress={handleStartWorkout} />
        </View>
      </SafeAreaView>
    );
  }

  const groupIds = Array.from(new Set([...sets.map((s) => s.exercise_id), ...pendingIds])).sort(
    (a, b) => (exerciseById[a]?.name ?? '').localeCompare(exerciseById[b]?.name ?? '')
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Current workout</Text>
          <Text style={styles.subtitle}>
            Started {new Date(workout.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {groupIds.length === 0 ? (
          <Text style={styles.emptySubtitle}>No exercises yet. Add one below.</Text>
        ) : null}

        {groupIds.map((exerciseId) => {
          const exercise = exerciseById[exerciseId];
          if (!exercise) return null;
          const exerciseSets = sets.filter((s) => s.exercise_id === exerciseId);
          const input = inputs[exerciseId] ?? { reps: '', weight: '', rpe: '' };

          return (
            <View key={exerciseId} style={styles.card}>
              <View style={styles.cardHeader}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => router.push(`/(tabs)/learn/exercises/${exerciseId}`)}
                >
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMeta}>
                    {exercise.muscle_group} · target {exercise.default_sets}×{exercise.default_reps}
                  </Text>
                </Pressable>
                {exerciseSets.length === 0 ? (
                  <Pressable onPress={() => removePendingExercise(exerciseId)}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                ) : null}
              </View>

              {exerciseSets.map((set) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setText}>
                    Set {set.set_number}: {set.reps ?? '–'} reps
                    {set.weight_kg ? ` @ ${set.weight_kg} kg` : ''}
                    {set.rpe ? ` · RPE ${set.rpe}` : ''}
                  </Text>
                  <Pressable onPress={() => handleDeleteSet(set.id)}>
                    <Text style={styles.remove}>✕</Text>
                  </Pressable>
                </View>
              ))}

              <View style={styles.inputRow}>
                <View style={styles.smallInput}>
                  <TextField
                    placeholder={`${exercise.default_reps}`}
                    label="Reps"
                    keyboardType="numeric"
                    value={input.reps}
                    onChangeText={(v) => updateInput(exerciseId, 'reps', v)}
                  />
                </View>
                <View style={styles.smallInput}>
                  <TextField
                    placeholder="kg"
                    label="Weight"
                    keyboardType="numeric"
                    value={input.weight}
                    onChangeText={(v) => updateInput(exerciseId, 'weight', v)}
                  />
                </View>
                <View style={styles.smallInput}>
                  <TextField
                    placeholder="1-10"
                    label="RPE"
                    keyboardType="numeric"
                    value={input.rpe}
                    onChangeText={(v) => updateInput(exerciseId, 'rpe', v)}
                  />
                </View>
              </View>
              <Button
                title="Add set"
                variant="secondary"
                loading={savingExerciseId === exerciseId}
                onPress={() => handleAddSet(exerciseId)}
              />
            </View>
          );
        })}

        <View style={{ marginTop: spacing.md }}>
          <Button
            title="Add exercise"
            variant="secondary"
            onPress={() => router.push('/(tabs)/log/picker')}
          />
        </View>

        <View style={styles.footer}>
          <Button title="Finish workout" onPress={confirmFinish} />
          <View style={{ height: spacing.sm }} />
          <Button title="Discard workout" variant="danger" onPress={confirmDiscard} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: spacing.xl,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  remove: {
    color: colors.danger,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  setText: {
    fontSize: 14,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallInput: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
