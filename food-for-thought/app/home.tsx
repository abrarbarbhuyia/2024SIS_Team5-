import { View, Image, FlatList } from "react-native";
import { router } from "expo-router";
import { Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "@/components/Header";
import RecommendedRestaurant from "@/components/RecommendedRestaurant";
import MapView, { Marker } from "react-native-maps";
import { styles } from '../styles/app-styles'; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from 'expo-constants';
import { Restaurant } from "@/app/map";
import Layout from "@/components/Layout";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTextValue } from "@/utils";

interface UserPreferences {
  name: string;
  type: string;
}

// Component
const Home = () => {
  const [fetchedRestaurants, setFetchedRestaurants] = useState<Restaurant[]>([]);
  const [username, setUsername] = useState<string>();
  const [activeFilters, setActiveFilters] = useState<
    { type: string; value: string }[]
  >([]);
  const [filterByDietary, setFilterByDietary] = useState<boolean>(false);

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  const pic = require('../assets/images/react-logo.png'); // placeholder restaurant image

  const loadUser = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  //Load the filterByDietary toggle value
  const loadSettings = async () => {
    try {
      const storedFilterByDietary = await AsyncStorage.getItem(
        "filterByDietary"
      );
      if (storedFilterByDietary !== null) {
        setFilterByDietary(JSON.parse(storedFilterByDietary));
      }
    } catch (error) {
      console.error("Error loading settings", error);
    }
  };

  React.useEffect(() => {
    loadUser();
    loadSettings();
  }, [loadUser]);

  const fetchUserPreferences = async (username: string) => {
    // if a user is logged in AND has filter by dietary preferences toggleOn - we can fetch their filters - otherwise we use state
    /* if they're logged in, grab the preferences associated with this username */
    if (filterByDietary) {
      try {
        await axios
          .get(`http://${HOST_IP}:4000/user/getUserPreference/${username}`)
          .then((response) => {
            /* set the active filters to these preferences */
            if (response.data.length > 0) {
              setActiveFilters(
                response.data.map((p: UserPreferences) => ({
                  type:
                    p.type == "Cuisine"
                      ? formatTextValue(`${p.type}`)
                      : formatTextValue(`${p.type}s`),
                  value: p.name,
                }))
              );
            }
          });
      } catch (error) {
        console.error("Error fetching user preferences", error);
      }
    }
  };

  useEffect(() => {
    if (username && filterByDietary) {
      fetchUserPreferences(username);
    }
  }, [filterByDietary]);

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

  const handleSearch = (search: string) => {
    // Temp fix for onSearch error. Potentially route to map.tsx and parse searchFilter.
    return '';
  };

  // Carousel view + styling
  const renderItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => router.push({pathname: '/restaurant', params: {restaurant: JSON.stringify(item), activeFilters: JSON.stringify(activeFilters)}})}>
      <Image source={ item.foodPhotos && item.foodPhotos.length > 0 ? { uri: item.foodPhotos[0]} : pic} style={styles.homeImage} />        
        <Text numberOfLines={1} style={styles.recentLabel}>{item.name || 'Restaurant Title'}</Text>
        <Text numberOfLines={1} style={styles.recentComment}>{item.cuisineType && item.cuisineType.length > 0 ? item.cuisineType.map((cuisineObj: any) => cuisineObj.cuisineType).join(', ') : 'Other'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
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
        {/* passing in static restaurants, but can handle any passed in */}
        {activeFilters.length > 0 ? (
          <>
            <RecommendedRestaurant restaurant={fetchedRestaurants[0]} />
            <RecommendedRestaurant restaurant={fetchedRestaurants[2]} />
          </>
        ) : (
          <Text>No filters available</Text> // This can help with debugging too
        )}
      </Card>
    </Layout>
  );
}

export default Home;
