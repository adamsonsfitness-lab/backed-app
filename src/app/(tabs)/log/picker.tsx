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

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function moveItem(items: string[], index: number, direction: -1 | 1): string[] {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export default function ExercisePicker() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const [muscleGroupOrderOverride, setMuscleGroupOrderOverride] = useState<string[] | null>(null);
  const [equipmentOrderOverride, setEquipmentOrderOverride] = useState<string[] | null>(null);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<Set<string>>(new Set());
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(new Set());
  const [reorderingMuscleGroups, setReorderingMuscleGroups] = useState(false);
  const [reorderingEquipment, setReorderingEquipment] = useState(false);

  useEffect(() => {
    getExercises()
      .then(setExercises)
      .finally(() => setLoading(false));
  }, []);

  const defaultMuscleGroupOrder = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.muscle_group))).sort(),
    [exercises]
  );
  const defaultEquipmentOrder = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.equipment))).sort(),
    [exercises]
  );
  const muscleGroupOrder = muscleGroupOrderOverride ?? defaultMuscleGroupOrder;
  const equipmentOrder = equipmentOrderOverride ?? defaultEquipmentOrder;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      if (selectedMuscleGroups.size > 0 && !selectedMuscleGroups.has(exercise.muscle_group)) {
        return false;
      }
      if (selectedEquipment.size > 0 && !selectedEquipment.has(exercise.equipment)) {
        return false;
      }
      if (!q) return true;
      return (
        exercise.name.toLowerCase().includes(q) || exercise.muscle_group.toLowerCase().includes(q)
      );
    });
  }, [exercises, query, selectedMuscleGroups, selectedEquipment]);

  function selectExercise(exercise: Exercise) {
    router.dismissTo({ pathname: '/(tabs)/log', params: { addExerciseId: exercise.id } });
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
        options={muscleGroupOrder}
        selected={selectedMuscleGroups}
        onToggle={(value) => setSelectedMuscleGroups((prev) => toggleInSet(prev, value))}
        onClear={() => setSelectedMuscleGroups(new Set())}
        reordering={reorderingMuscleGroups}
        onToggleReordering={() => setReorderingMuscleGroups((prev) => !prev)}
        onMove={(index, direction) =>
          setMuscleGroupOrderOverride(moveItem(muscleGroupOrder, index, direction))
        }
      />
      <FilterRow
        label="Equipment"
        options={equipmentOrder}
        selected={selectedEquipment}
        onToggle={(value) => setSelectedEquipment((prev) => toggleInSet(prev, value))}
        onClear={() => setSelectedEquipment(new Set())}
        reordering={reorderingEquipment}
        onToggleReordering={() => setReorderingEquipment((prev) => !prev)}
        onMove={(index, direction) =>
          setEquipmentOrderOverride(moveItem(equipmentOrder, index, direction))
        }
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

interface FilterRowProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
  reordering: boolean;
  onToggleReordering: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
}

function FilterRow({
  label,
  options,
  selected,
  onToggle,
  onClear,
  reordering,
  onToggleReordering,
  onMove,
}: FilterRowProps) {
  if (options.length === 0) return null;

  return (
    <View style={styles.filterBlock}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterLabel}>{label}</Text>
        <Pressable onPress={onToggleReordering} hitSlop={8}>
          <Text style={styles.reorderToggle}>{reordering ? 'Done' : 'Reorder'}</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {!reordering && (
          <Chip label="All" active={selected.size === 0} onPress={onClear} />
        )}
        {options.map((option, index) =>
          reordering ? (
            <ReorderChip
              key={option}
              label={option}
              onMoveLeft={index > 0 ? () => onMove(index, -1) : undefined}
              onMoveRight={index < options.length - 1 ? () => onMove(index, 1) : undefined}
            />
          ) : (
            <Chip
              key={option}
              label={option}
              active={selected.has(option)}
              onPress={() => onToggle(option)}
            />
          )
        )}
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

function ReorderChip({
  label,
  onMoveLeft,
  onMoveRight,
}: {
  label: string;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}) {
  return (
    <View style={[styles.chip, styles.reorderChip]}>
      <Pressable onPress={onMoveLeft} disabled={!onMoveLeft} hitSlop={6}>
        <Text style={[styles.reorderArrow, !onMoveLeft && styles.reorderArrowDisabled]}>‹</Text>
      </Pressable>
      <Text style={styles.chipText}>{label}</Text>
      <Pressable onPress={onMoveRight} disabled={!onMoveRight} hitSlop={6}>
        <Text style={[styles.reorderArrow, !onMoveRight && styles.reorderArrowDisabled]}>›</Text>
      </Pressable>
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
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filterBlock: {
    marginTop: spacing.sm,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reorderToggle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
  reorderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
  },
  reorderArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: 2,
  },
  reorderArrowDisabled: {
    color: colors.border,
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
