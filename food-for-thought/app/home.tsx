import { View, Dimensions, Image, StyleSheet, FlatList, ImageSourcePropType } from "react-native";
import { Link, router } from "expo-router";
import { Button, Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "@/components/Header";     
import pic from '../assets/images/react-logo.png';
import MapView, { Marker } from "react-native-maps";
import { styles } from '../styles/app-styles'; 

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


const Home = () => {
  //carousel view + styling
  const renderItem = ({item}: any) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.homeImage} />
      <Text style={styles.recentLabel}>{item.label}</Text>
      <Text style={styles.recentComment}>{item.secondLabel}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header />
      {/* Card for the Restaurant finder */}
        <TouchableOpacity onPress={() => router.push('/map')}>
          <Card containerStyle={styles.finderCard}>
            <View style={{  }}>
              <SearchBar/>             
            </View>
            <MapView
              style={styles.map}
              initialRegion={{ // initial region is hardcoded to UTS Tower
                latitude: -33.88336558611229,
                longitude: 151.2009263036271,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker 
                coordinate={{ latitude:  -33.88336558611229, longitude: 151.2009263036271 }}
                title={"My location"} >
                <View style={styles.filledCircle} />
              </Marker>
            </MapView>
          </Card>
        </TouchableOpacity>
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
        {/* <Link href={"/login"}>Login</Link>
        <Link href={"/map"}>Click here to see the Map Display</Link> */}
      </Card>
    </View>
  );
};

export default Home;