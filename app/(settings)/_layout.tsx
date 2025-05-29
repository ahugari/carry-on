import { Stack as ExpoStack } from 'expo-router/stack';

export default function SettingsLayout() {
  return (
    <ExpoStack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
          color: '#1F2937',
        },
        headerShadowVisible: false,
      }}
    >
      <ExpoStack.Screen
        name="reviews"
        options={{
          title: 'Reviews',
        }}
      />
      <ExpoStack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
        }}
      />
      <ExpoStack.Screen
        name="help-center"
        options={{
          title: 'Help Center',
        }}
      />
      <ExpoStack.Screen
        name="trust-safety"
        options={{
          title: 'Trust & Safety',
        }}
      />
      <ExpoStack.Screen
        name="add-payment-method"
        options={{
          title: 'Add Payment Method',
        }}
      />
    </ExpoStack>
  );
} 