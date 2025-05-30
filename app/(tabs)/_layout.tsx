import { Tabs } from 'expo-router/tabs';
import { Home, Search, MessageCircle, Briefcase, User } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: IconProps) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }: IconProps) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }: IconProps) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Activities',
          tabBarIcon: ({ color, size }: IconProps) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: IconProps) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});