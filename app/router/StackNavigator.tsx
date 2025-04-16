import React, { useEffect } from "react";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { RootStackParamList } from "../Types/types";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import { useAuth } from "../../Firebase/Services/authService";
import CoffeeShopScreen from "../screens/CoffeeShopScreen/CoffeeShopScreen";
import CreateForumPostScreen from "../screens/Forum/CreateForumPostScreen";
import PostScreen from "../screens/Forum/PostScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import OnboardingSwiper from "../screens/OnboardingScreen/OnboradingScreen";

const Stack = createStackNavigator<RootStackParamList>();

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">;

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, "Register">;

export default function StackNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator initialRouteName={currentUser ? "Tabs" : "Login"}>
      {currentUser ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onBoard"
            component={OnboardingSwiper}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CoffeeShop"
            component={CoffeeShopScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateForumPost"
            component={CreateForumPostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
