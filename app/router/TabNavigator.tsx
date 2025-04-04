import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../Types/types';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import SreachScreen from '../screens/Search/SreachScreen';
import ForumScreen from '../screens/Forum/ForumScreen';
import ProfileNavigator from './ProfileNavigator'; // Import the ProfileNavigator

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Forum') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#854836',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#D8D2C2',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SreachScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Forum" component={ForumScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
