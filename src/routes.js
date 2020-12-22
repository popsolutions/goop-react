import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Main from './pages/Main';
import Termos from './pages/Termos';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

function Routes() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode='none' >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Termos" component={Termos} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Routes;