import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Learn' }} />
      <Stack.Screen name="exercises/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="principles/[id]" options={{ title: 'Principle' }} />
    </Stack>
  );
}
