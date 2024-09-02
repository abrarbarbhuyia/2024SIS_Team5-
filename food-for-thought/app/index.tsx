import { View } from "react-native";
import { Link } from "expo-router";
import { Button, Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Index() {
  return (
    <View>
      <TouchableOpacity /* onPress={() => navigation.navigate('map')} */>
        <Card>
            <Icon type="feather" name="arrow-right" color="black"></Icon>
            <SearchBar/>
          <Card.Image
              style={{ padding: 0 }}
              source={{
                uri:
                  'https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png',
              }}
            />
        </Card>
      </TouchableOpacity>
      <Link href={"/map"}>Click here to see the Map Display</Link>
    </View>
  );
}
