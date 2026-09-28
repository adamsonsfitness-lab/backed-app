import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/theme';

interface BrandSplashProps {
  exiting: boolean;
  onExitComplete: () => void;
}

export function BrandSplash({ exiting, onExitComplete }: BrandSplashProps) {
  // Covers the screen immediately (opaque from the first frame) and only
  // animates out once `exiting` is true. Kept separate from the logo's own
  // entrance animation below so there's never a frame where this overlay
  // is transparent and the screen underneath flashes through.
  const [overlayOpacity] = useState(() => new Animated.Value(1));

  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.92));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    if (!exiting) return;
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 350,
      delay: 250,
      useNativeDriver: true,
    }).start(onExitComplete);
  }, [exiting, overlayOpacity, onExitComplete]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, { opacity: overlayOpacity }]}
      pointerEvents="none"
    >
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Text style={styles.wordmark}>Backed</Text>
        <Text style={styles.tagline}>Log your training. Know why it works.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
