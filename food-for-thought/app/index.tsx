import { View, Dimensions, Image, StyleSheet, FlatList } from "react-native";
//import { SearchBar } from "../components/SearchBar";
import { Link } from "expo-router";
import Header from "@/components/Header";
import { Card, Text, Icon } from '@rneui/themed';
import pic from '../assets/images/react-logo.png';

//mock data images for carousel
const carouselData = [
  { id: '1', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '2', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '3', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '4', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '5', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '6', image: pic, label: 'Food item', secondLabel: 'Food' },
  { id: '7', image: pic, label: 'Food item', secondLabel: 'Food' },
];

export default function Index() {
  //carousel view + styling
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.recentLabel}>{item.label}</Text>
      <Text style={styles.recentComment}>{item.secondLabel}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header></Header>
      {/* Card for the Restaurant finder */}
      <Card containerStyle={styles.finderCard}>
        {/* SearchBar */}
        {/* map snip, for now just link to map */}
        <Link href={"/map"} >Navigate to Map Display</Link>
      </Card>
      {/* Card for recently visited Restaurants */}
      <Card containerStyle={styles.recentCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text h4>Last Visited</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recent arrow clicked")} />
        </View>
        {/* rendering the pics in carousel */}
        <FlatList
          data={carouselData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />
      </Card>
      {/* Card for restaurant recommndations */}
      <Card containerStyle={styles.recommendationsCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text h4>Recommendations</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recommendations arrow clicked")} />
        </View>
      </Card>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E6D7FA",
  },
  finderCard: {
    width: width - 32,
    height: 170,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recentCard: {
    width: width - 32,
    height: 230,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recommendationsCard: {
    width: width - 32,
    height: 265,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    width: 120,
    height: 150,
  },
  image: {
    width: '100%',
  },
  recentLabel: {
    marginLeft: 5,
    marginTop: 5,
  },
  recentComment: {
    marginLeft: 5,
    fontSize: 12,
    opacity: 0.5,
  }
});
