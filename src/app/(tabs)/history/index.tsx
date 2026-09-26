import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { getWorkoutHistory } from '@/lib/queries';
import type { Workout } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

function formatDuration(startedAt: string, finishedAt: string) {
  const minutes = Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 60000);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function HistoryScreen() {
  const { session } = useAuth();
  const userId = session!.user.id;
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      getWorkoutHistory(userId).then((data) => {
        if (!cancelled) {
          setWorkouts(data);
          setLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [userId])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/history/${item.id}`)}>
            <Text style={styles.date}>
              {new Date(item.started_at).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            {item.finished_at ? (
              <Text style={styles.meta}>{formatDuration(item.started_at, item.finished_at)}</Text>
            ) : null}
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySubtitle}>Finished workouts will show up here.</Text>
          </View>
        }
      />
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
    paddingTop: spacing.xl * 2,
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
