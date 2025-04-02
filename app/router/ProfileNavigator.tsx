import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen'; // Import the Edit Profile screen

export type ProfileStackParamList = {
  Profile: undefined; // Main Profile Screen
  EditProfile: undefined; // Edit Profile Screen
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }} // Hide header for the Profile screen
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }} // Show a title in the header for the Edit Profile screen
      />
    </ProfileStack.Navigator>
  );
}
