import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#7CB9E8" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="home" size={24} color="#7CB9E8" />
            ) : (
              <FontAwesome name="home" size={24} color="black" />
            ),
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#7CB9E8" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
                <MaterialIcons name="account-circle" size={24} color="#7CB9E8" />
            ) : (
                <MaterialIcons name="account-circle" size={24} color="black" />
            ),
        }}
      />
            <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarLabelStyle: { color: "#7CB9E8" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
                <Ionicons name="settings" size={24} color="#7CB9E8" />
            ) : (
                <Ionicons name="settings" size={24} color="black" />
            ),
        }}
      />
    </Tabs>
  );
}
