import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Citation } from '@/types/database';
import { colors, radius, spacing } from '@/theme';

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) {
    return null;
  }

  return (
    <View style={styles.list}>
      <Text style={styles.heading}>Sources</Text>
      {citations.map((citation) => (
        <CitationCard key={citation.id} citation={citation} />
      ))}
    </View>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable style={styles.card} onPress={() => setExpanded((prev) => !prev)}>
      <Text style={styles.title}>{citation.title}</Text>
      <Text style={styles.meta}>
        {citation.authors} · {citation.year} · {citation.journal}
      </Text>
      {expanded && (citation.summary || citation.details) ? (
        <View style={styles.details}>
          {citation.summary ? <Text style={styles.body}>{citation.summary}</Text> : null}
          {citation.details ? <Text style={styles.detailsText}>{citation.details}</Text> : null}
        </View>
      ) : null}
      <Text style={styles.toggle}>{expanded ? 'Show less' : 'Tap to read more'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.lg,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  details: {
    marginTop: spacing.sm,
  },
  body: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailsText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  toggle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },
});
