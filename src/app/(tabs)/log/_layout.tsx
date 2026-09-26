import { Stack } from 'expo-router';

export default function LogLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="picker" options={{ presentation: 'modal', headerShown: true, title: 'Add exercise' }} />
    </Stack>
  );
}
