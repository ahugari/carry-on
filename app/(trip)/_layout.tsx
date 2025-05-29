import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 