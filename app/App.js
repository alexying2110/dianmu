import React from 'react';
import {
  LogBox,
  Platform,
  Text,
  UIManager,
  View,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import Material from '@expo/vector-icons/MaterialIcons';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Alarm, Connections, Timer } from "./src/screens";

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

TaskManager.defineTask("Alarm", async () => {
  if (!global.device) {
    throw new Error("no fucking device");
  }
  console.log('HERE');
  try {
    let res = await global.device.write('fire\n\r');
    console.log(res);
    console.log('HERE1');
  } catch (e) {
    throw new Error("failed to fire for some reason");
  }
});

TaskManager.defineTask("Timer", async () => {
  if (!global.device) {
    throw new Error("no fucking device");
  }
  console.log('HERE');
  try {
    let res = await global.device.write('fire\n\r');
    console.log(res);
    console.log('HERE1');
  } catch (e) {
    throw new Error("failed to fire for some reason");
  }
});

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          zIndex: 0,
        },
        tabBarActiveTintColor: 'orchid',
        tabBarInactiveTintColor: 'grey',
      }}
    >
      <Tab.Screen 
        name={"Connect"}
        component={Connections}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Material 
              name={"bluetooth"}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen 
        name={"Alarm"}
        component={Alarm}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Material 
              name={"alarm"}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen 
        name={"Timer"}
        component={Timer}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Material 
              name={"timer"}
              size={size}
              color={color}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <TabNavigator/>
      </NavigationContainer>
  );
}
