import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MatchDetailsScreen from './screens/MatchDetailsScreen';
import StatsScreen from './screens/StatsScreen';
import NewsScreen from './screens/NewsScreen';
import ArticleScreen from './screens/ArticleScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetailsScreen}
        options={{ title: 'Match Details' }}
      />
    </Stack.Navigator>
  );
}

function NewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewsMain"
        component={NewsScreen}
        options={{ title: 'News' }}
      />
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={{ title: 'Full Article' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 4, height: 60 }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="football" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
