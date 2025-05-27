import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new/step-1" />
      <Stack.Screen name="new/step-2" />
      <Stack.Screen name="new/step-3" />
    </Stack>
  );
}