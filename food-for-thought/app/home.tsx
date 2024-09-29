import { View, Dimensions, Image, StyleSheet, FlatList, ImageSourcePropType } from "react-native";
import { Link, router } from "expo-router";
import { Button, Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "@/components/Header";     
import pic from '../assets/images/react-logo.png'; // Placeholder image
import RecommendedRestaurant from "@/components/RecommendedRestaurant";
import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure you import axios if you're using it

// For now, static API call - will handle user variation later
const API_URL = "http://192.168.1.208:4000";

// Component
const Home = () => {
  const [fetchedRestaurants, setFetchedRestaurants] = useState<any[]>([]); // Specify the type here

  // Fetch specific restaurants by ID
  const fetchRestaurants = async () => {
    const restaurantIds = ['4e4a1510483b16676e3a760f', '5296bc3011d29d380e6f36d2', '4b679079f964a52078552be3', '592fcdf29ef8ef6604fa5b64', '4b09eb00f964a520bf1f23e3'];
    const promises = restaurantIds.map(id => {
      const url = `${API_URL}/restaurant/getIngredient/${id}`;
      console.log("Fetching:", url);
      return axios.get(url)
        .then(response => response.data) // Return only the data part
        .catch(error => {
          console.error(`Error fetching restaurant ID ${id}:`, error.message);
          return null; // Return null for this restaurant if there's an error
        });
    });

    const results = await Promise.all(promises);
    // Filter out any null values from failed requests
    const restaurants = results.flat().filter(restaurant => restaurant !== null);
    setFetchedRestaurants(restaurants);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Carousel view + styling
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => router.push('/restaurant')}>
      <Image source={ item.restaurantPhotos && item.restaurantPhotos.length > 0 ? { uri: item.restaurantPhotos[0]} : pic} style={styles.image} />        
        <Text numberOfLines={1} style={styles.recentLabel}>{item.name || 'Restaurant Title'}</Text>
        <Text numberOfLines={1} style={styles.recentComment}>{item.cuisine && item.cuisine.length > 0 ? item.cuisine.join(', ') : 'Other'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header></Header>
      {/* Card for the Restaurant finder */}
      <TouchableOpacity onPress={() => router.push('/map')}>
        <Card containerStyle={styles.finderCard}>
          <View>
            <SearchBar />             
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
          <Text h4 style={{ color: '#2E1C47' }}>Last Visited</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recent arrow clicked")} />
        </View>
        {/* Rendering the fetched restaurant data in carousel */}
        <FlatList
          data={fetchedRestaurants}
          renderItem={renderItem}
          keyExtractor={item => item.restaurantId} 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />
      </Card>
      {/* Card for restaurant recommendations */}
      <Card containerStyle={styles.recommendationsCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text h4 style={{ color: '#2E1C47' }}>Recommendations</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recommendations arrow clicked")} />
        </View>
        
        {/* <RecommendedRestaurant />
        <RecommendedRestaurant /> */}
      </Card>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E6D7FA",
  },
  finderCard: {
    width: width - 32,
    height: 200,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recentCard: {
    width: width - 32,
    height: 210,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recommendationsCard: {
    width: width - 32,
    height: 275,
    backgroundColor: "#FBF8FF",
    padding: 10,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
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
    height: 145,
  },
  image: {
    width: '100%',
    height: 100,
  },
  recentLabel: {
    marginLeft: 5,
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  recentComment: {
    marginLeft: 5,
    fontSize: 10,
    opacity: 0.5,
  },
  filledCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 12.5, 
    borderStyle:'solid',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#0B84FF',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 4,
  },
  map: {
    minWidth: 300,
    width: '100%',
    height: '57%',
    borderRadius: 15
  },
});

export default Home;
