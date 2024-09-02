import { Text, View, Button, Dimensions } from "react-native";
//import { SearchBar } from "../components/SearchBar";
import { Link } from "expo-router";
import Header from "@/components/Header";

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6D7FA",
      }}
    >
      <Header></Header>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/map"}>Navigate to Map Display</Link>
    </View>
  );
}
