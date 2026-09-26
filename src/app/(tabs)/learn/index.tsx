import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExercises, getPrinciples } from '@/lib/queries';
import { TextField } from '@/components/TextField';
import type { Exercise, Principle } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

type Mode = 'exercises' | 'principles';

export default function LearnScreen() {
  const [mode, setMode] = useState<Mode>('exercises');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Promise.all([getExercises(), getPrinciples()]).then(([exerciseData, principleData]) => {
      setExercises(exerciseData);
      setPrinciples(principleData);
      setLoading(false);
    });
  }, []);

  const filteredExercises = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter(
      (e) => e.name.toLowerCase().includes(q) || e.muscle_group.toLowerCase().includes(q)
    );
  }, [exercises, query]);

  const filteredPrinciples = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return principles;
    return principles.filter((p) => p.title.toLowerCase().includes(q));
  }, [principles, query]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.segmentWrap}>
        <SegmentButton label="Exercises" active={mode === 'exercises'} onPress={() => setMode('exercises')} />
        <SegmentButton label="Principles" active={mode === 'principles'} onPress={() => setMode('principles')} />
      </View>

      <View style={styles.searchWrap}>
        <TextField
          placeholder={mode === 'exercises' ? 'Search exercises' : 'Search principles'}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} />
      ) : mode === 'exercises' ? (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => router.push(`/(tabs)/learn/exercises/${item.id}`)}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.muscle_group} · {item.category}
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={filteredPrinciples}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => router.push(`/(tabs)/learn/principles/${item.id}`)}
            >
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.short_answer}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.segment, active && styles.segmentActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  segmentWrap: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.text,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
