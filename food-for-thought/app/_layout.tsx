import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
      <GestureHandlerRootView style={{flex: 1}}>
          <Stack>
            <Stack.Screen name="index" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="map" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="login" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="register" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="landing" options={{headerShown:false}}/>
          </Stack>
      </GestureHandlerRootView>
  );
}
