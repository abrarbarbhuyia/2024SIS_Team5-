import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1,}}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="map" />
         <Stack.Screen name="login" />
        {/* options={{headerShown:false}} */}
      </Stack>
    </GestureHandlerRootView>
  );
}
