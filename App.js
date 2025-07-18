import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import ChatBot from './ChatBot';
import TravelPlanner from './TravelPlanner';
import ChatBot from './ChatBot';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatBot">
        <Stack.Screen name="ChatBot" component={ChatBot} options={{ title: '🤖 Wellcome',headerStyle: {
      backgroundColor: '#5777ecff', // 💚 Change this to your desired color
    },
    headerTintColor: '#fff', // 🤍 This changes the text/icon color
    headerTitleStyle: {
      fontWeight: 'bold',
    }, }} />
        <Stack.Screen name="TravelPlanner" component={TravelPlanner} options={{ title: '✈️ Travel Assistant' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
