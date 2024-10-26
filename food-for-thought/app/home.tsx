import { View, Image, FlatList } from "react-native";
import { router } from "expo-router";
import { Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import RecommendedRestaurant from "@/components/RecommendedRestaurant";
import MapView, { Marker } from "react-native-maps";
import { currentFont, styles } from '../styles/app-styles'; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from 'expo-constants';
import { cuisineType, Restaurant } from "@/constants/interfaces";
import Layout from "@/components/Layout";
import SafetyWarning from "@/components/SafetyWarning";

// Component
const Home = () => {
  const [fetchedRestaurants, setFetchedRestaurants] = useState<Restaurant[]>([]);
  const [showModal, setShowModal] = useState<boolean>(true);

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
  const pic = require('../assets/images/react-logo.png'); // placeholder restaurant image

  // Fetch specific restaurants by ID
  const fetchRestaurants = async () => {
    //using static IDs from Mongo for now
    const restaurantIds = ['4e4a1510483b16676e3a760f', '5296bc3011d29d380e6f36d2', '4b679079f964a52078552be3', '592fcdf29ef8ef6604fa5b64', '4b09eb00f964a520bf1f23e3'];
    const promises = restaurantIds.map(id => {
      const url = `http://${HOST_IP}:4000/restaurant/getRestaurant/${id}`;
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

  const handleNotedPress = () => {
    setShowModal(false);
  };

  const handleSearch = (search: string) => {
    // Temp fix for onSearch error. Potentially route to map.tsx and parse searchFilter.
    return '';
  };

  // Carousel view + styling
  const renderItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => router.push({pathname: '/restaurant', params: {restaurant: JSON.stringify(item)}})}>
      <Image source={ item.foodPhotos && item.foodPhotos.length > 0 ? { uri: item.foodPhotos[0]} : pic} style={styles.homeImage} />        
        <Text numberOfLines={1} style={styles.recentLabel}>{item.name || 'Restaurant Title'}</Text>
        <Text numberOfLines={1} style={styles.recentComment}>{item.cuisineType && item.cuisineType.length > 0 ? item.cuisineType.map((cuisineObj: cuisineType) => cuisineObj.cuisineType).join(', ') : 'Other'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
      {showModal && <SafetyWarning handleNotedPress={ handleNotedPress } />} 
      {/* Card for the Restaurant finder */}
      <TouchableOpacity onPress={() => router.push('/map')}>
        <Card containerStyle={styles.finderCard}>
          <View>
            <SearchBar onSearch={handleSearch} />
          </View>
          <MapView
            style={styles.homeMap}
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
          <Text style={{ color: '#2E1C47', ...currentFont, fontWeight: 600, fontSize: 22 }}>Last Visited</Text>
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
          <Text style={{ color: '#2E1C47', ...currentFont, fontWeight: 500, fontSize: 22 }}>Recommendations</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recommendations arrow clicked")} />
        </View>
        {/* passing in static restaurants, but can handle any passed in */}
        <RecommendedRestaurant restaurant={fetchedRestaurants[2]}/>
        <RecommendedRestaurant restaurant={fetchedRestaurants[0]}/>
      </Card>
    </Layout>
  );
}

export default Home;
