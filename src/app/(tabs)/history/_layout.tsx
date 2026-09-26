import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function HistoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'History' }} />
      <Stack.Screen name="[id]" options={{ title: 'Workout' }} />
    </Stack>
  );
}
