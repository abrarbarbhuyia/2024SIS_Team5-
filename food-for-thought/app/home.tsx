import { View, Dimensions, Image, StyleSheet, FlatList, ImageSourcePropType } from "react-native";
import { Link, router } from "expo-router";
import { Button, Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "@/components/Header";     
import pic from '../assets/images/react-logo.png'; // Placeholder image
import RecommendedRestaurant from "@/components/RecommendedRestaurant";
import MapView, { Marker } from "react-native-maps";
import { styles } from '../styles/app-styles'; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from 'expo-constants';

// Component
const Home = () => {
  const [fetchedRestaurants, setFetchedRestaurants] = useState<any[]>([]);

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  // Fetch specific restaurants by ID
  const fetchRestaurants = async () => {
    //using static IDs from Mongo for now
    const restaurantIds = ['4e4a1510483b16676e3a760f', '5296bc3011d29d380e6f36d2', '4b679079f964a52078552be3', '592fcdf29ef8ef6604fa5b64', '4b09eb00f964a520bf1f23e3'];
    const promises = restaurantIds.map(id => {
      const url = `http://${HOST_IP}:4000/restaurant/getRestaurant/${id}`;
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
      <Image source={ item.restaurantPhotos && item.restaurantPhotos.length > 0 ? { uri: item.restaurantPhotos[0]} : pic} style={styles.homeImage} />        
        <Text numberOfLines={1} style={styles.recentLabel}>{item.name || 'Restaurant Title'}</Text>
        <Text numberOfLines={1} style={styles.recentComment}>{item.cuisine && item.cuisine.length > 0 ? item.cuisine.join(', ') : 'Other'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header homepage={true}></Header>
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
        <RecommendedRestaurant />
        <RecommendedRestaurant />
      </Card>
    </View>
  );
}

export default Home;
