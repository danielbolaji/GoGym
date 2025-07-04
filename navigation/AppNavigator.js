import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ShootingScreen from '../screens/ShootingScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import ShootingHistoryScreen from '../screens/ShootingHistoryScreen';
import ChallengeHistoryScreen from '../screens/ChallengeHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Shooting" component={ShootingScreen} />
        <Stack.Screen name="Challenge" component={ChallengeScreen} />
        <Stack.Screen name="History" component={WorkoutHistoryScreen} />
        <Stack.Screen name="Shooting History" component={ShootingHistoryScreen} />
        <Stack.Screen name="ChallengeHistory" component={ChallengeHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}