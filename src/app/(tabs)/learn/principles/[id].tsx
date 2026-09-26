import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getPrincipleWithCitations } from '@/lib/queries';
import { CitationList } from '@/components/CitationList';
import type { PrincipleWithCitations } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

export default function PrincipleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [principle, setPrinciple] = useState<PrincipleWithCitations | null>(null);

  useEffect(() => {
    getPrincipleWithCitations(id).then(setPrinciple);
  }, [id]);

  if (!principle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{principle.title}</Text>

      <View style={styles.answerCard}>
        <Text style={styles.answer}>{principle.short_answer}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Explanation</Text>
        <Text style={styles.explanation}>{principle.explanation}</Text>
      </View>

      <CitationList citations={principle.citations} />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  answerCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  answer: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 22,
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
  explanation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});
