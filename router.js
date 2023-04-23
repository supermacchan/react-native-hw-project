import React from "react";
import { Pressable } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

import { RegistrationScreen } from './Screens/auth/RegistrationScreen';
import { LoginScreen } from './Screens/auth/LoginScreen';
import { CreatePostsScreen } from './Screens/main/CreatePostsScreen';
import { PostsScreen } from './Screens/main/PostsScreen';
import { ProfileScreen } from './Screens/main/ProfileScreen';

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Registration"
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      initialRouteName="PostsScreen"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarItemStyle: { borderRadius: 20, width: 70, height: 40 },
        tabBarStyle: {
          paddingTop: 9,
          justifyContent: "center",
          paddingLeft: 82,
          paddingRight: 82,
          paddingBottom: 47,
        },
        tabBarIconStyle: { color: "#212121CC" },
      }}
    >
      <MainTab.Screen
        options={{
            headerShown: false,
            tabBarIcon: ({ focused, size, color }) => (
                <SimpleLineIcons name="grid" size={24} color={color} />
            ),
        }}
        name="PostsScreen"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: true,
            title: "Создать публикацию",
            headerTitleStyle: {
                fontSize: 17,
                fontFamily: 'Roboto-Medium',
                color: '#212121',
            },
            headerStyle: {
                borderBottomWidth: 0.3,
                borderBottomColor: '#B3B3B3',
            },
          headerTitleAlign: 'center',
            // headerBackVisible: true,
            headerLeft: ({ focused, size, color }) => (
              <Pressable
                style={{ paddingLeft: 15 }}
              >
                <AntDesign name="arrowleft" size={24} color="#212121" />
              </Pressable>
            ),
            tabBarIcon: ({ focused, size, color }) => (
              <AntDesign name="plus" size={24} color={color} />
            ),
        }}
        name="Создать публикацию"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};