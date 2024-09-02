import { Text, View } from "react-native";
import { SearchBar } from '@/components/SearchBar';
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/map"}>Navigate to Map Display</Link>
    </View>
  );
}
