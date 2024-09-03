import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
      <GestureHandlerRootView style={{flex: 1}}>
          <Stack>
            <Stack.Screen name="index" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="map" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
            <Stack.Screen name="login" />
            <Stack.Screen name="restaurant" options={{headerShown:false,fullScreenGestureEnabled:true,gestureDirection:'horizontal'}}/>
          </Stack>
      </GestureHandlerRootView>
  );
}
