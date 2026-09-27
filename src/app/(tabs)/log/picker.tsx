import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExercises } from '@/lib/queries';
import { TextField } from '@/components/TextField';
import type { Exercise } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

export default function ExercisePicker() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);

  useEffect(() => {
    getExercises()
      .then(setExercises)
      .finally(() => setLoading(false));
  }, []);

  const muscleGroups = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.muscle_group))).sort(),
    [exercises]
  );
  const equipmentOptions = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.equipment))).sort(),
    [exercises]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      if (muscleGroup && exercise.muscle_group !== muscleGroup) return false;
      if (equipment && exercise.equipment !== equipment) return false;
      if (!q) return true;
      return (
        exercise.name.toLowerCase().includes(q) || exercise.muscle_group.toLowerCase().includes(q)
      );
    });
  }, [exercises, query, muscleGroup, equipment]);

  function selectExercise(exercise: Exercise) {
    router.replace({ pathname: '/(tabs)/log', params: { addExerciseId: exercise.id } });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchWrap}>
        <TextField
          placeholder="Search exercises"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      <FilterRow
        label="Muscle group"
        options={muscleGroups}
        selected={muscleGroup}
        onSelect={setMuscleGroup}
      />
      <FilterRow
        label="Equipment"
        options={equipmentOptions}
        selected={equipment}
        onSelect={setEquipment}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => selectExercise(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.muscle_group} · {item.equipment} · {item.category}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No exercises match these filters.</Text>}
      />
    </SafeAreaView>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  if (options.length === 0) return null;

  return (
    <View style={styles.filterBlock}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip label="All" active={selected === null} onPress={() => onSelect(null)} />
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            active={selected === option}
            onPress={() => onSelect(selected === option ? null : option)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
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
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filterBlock: {
    marginTop: spacing.sm,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.lg,
    marginBottom: spacing.xs,
  },
  chipRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.primaryText,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
