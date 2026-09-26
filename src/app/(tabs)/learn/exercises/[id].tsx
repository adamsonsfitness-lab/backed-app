import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getExerciseWithCitations } from '@/lib/queries';
import { CitationList } from '@/components/CitationList';
import type { ExerciseWithCitations } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<ExerciseWithCitations | null>(null);

  useEffect(() => {
    getExerciseWithCitations(id).then(setExercise);
  }, [id]);

  if (!exercise) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.meta}>
        {exercise.muscle_group} · {exercise.equipment} · {exercise.category}
      </Text>
      {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 ? (
        <Text style={styles.secondary}>Also works: {exercise.secondary_muscles.join(', ')}</Text>
      ) : null}

      <View style={styles.statsRow}>
        <Stat label="Sets" value={`${exercise.default_sets}`} />
        <Stat label="Reps" value={`${exercise.default_reps}`} />
        <Stat label="Rest" value={`${exercise.default_rest_seconds}s`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Why this exercise</Text>
        <Text style={styles.why}>{exercise.why}</Text>
      </View>

      <CitationList citations={exercise.citations} />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  secondary: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  why: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});
