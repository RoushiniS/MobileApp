import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
           tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="donationOptions"
        options={{
          title: 'Donations',
          headerShown: true,
           tabBarIcon: ({ color, size }) => (
            <Ionicons name="water" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}