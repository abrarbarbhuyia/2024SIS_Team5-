import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './map';
import Index from './index';

export default function RootLayout() {
  // const Stack = createNativeStackNavigator();
  return (
    // <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
          {/* <Stack.Navigator> */}
          <Stack>
            <Stack.Screen name="index" /* component={Index} */ options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="map" /* component={Map} */ options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
          </Stack>
          {/* </Stack.Navigator> */}
      </GestureHandlerRootView>
    // </NavigationContainer>
  );
}
