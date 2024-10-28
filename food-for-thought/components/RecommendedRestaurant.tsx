import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text, Icon } from '@rneui/themed';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Constants from 'expo-constants';
import { cuisineType, JwtPayload, Meal, Menu, Restaurant } from '@/constants/interfaces';
import { currentFont, styles } from "@/styles/app-styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { formatTextValue } from "@/utils";

interface UserPreferences {
    name: string;
    type: string;
  }

export default function RecommendedRestaurant({ restaurant }: { restaurant: Restaurant }) {
    const [menu, setMenu] = useState<Menu>();
    const [meals, setMeals] = useState<Meal[]>([]);
    const [favourites, setFavourites] = useState<string[]>([]);
    const item = restaurant || {};
    const restaurantId = item.restaurantId;
    const [username, setUsername] = useState<string>();
    const [activeFilters, setActiveFilters] = useState<
        { type: string; value: string }[]
    >([]);
    const [filterByDietary, setFilterByDietary] = useState<boolean>(false);

    const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

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

    useEffect(() => {
        if (restaurantId) {
            fetchMenu(restaurantId);
        }
    }, [restaurantId]);

    //fetch menu using restaurantId
    const fetchMenu = async (restaurantId: string) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/menu/getMenu/${restaurantId}`);
            const menuData = response.data;
            setMenu(menuData);

            if (menuData && menuData[0]?.menuId) {
                fetchMeals(menuData[0].menuId); //fetch meals from menuId, returns full list
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const fetchMeals = async (menuId: string) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${menuId}`);
            setMeals(response.data);
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    };

    const fetchFavourites = async () => {
        const url = `http://${HOST_IP}:4000/user/getUser/${username}`;
        await axios.get(url)
            .then(response => {
                const userDetails = response.data;
                const favouritesArray: string[] = userDetails[0].favourites ?? [];
                setFavourites(favouritesArray);
            })
            .catch(error => console.error("Error fetching the favourites", error));
    }

    useEffect(() => {
        if (username) {
            fetchFavourites();
        }
    }, [username]);

    const toggleFavourite = async () => {
        try {
            if (!favourites.find(f => restaurantId === f)) {
                const response = await axios.put(`http://${HOST_IP}:4000/user/addFavourite/${username}/${restaurantId}`);
                setFavourites(favourites.concat([restaurantId]));
                if (response.status !== 200) {
                    console.log("Error adding favourite:", response);
                }
            } else {
                const response = await axios.delete(`http://${HOST_IP}:4000/user/deleteFavourite/${username}/${restaurantId}`);
                setFavourites(favourites.filter(f => f !== restaurantId));
                if (response.status !== 200) {
                    console.log("Error deleting favourite:", response);
                }
            }
        } catch (error) {
            console.error('Error updating favourite status:', error);
        }
    };

    return (
        <TouchableOpacity
            style={{ height: '42%', padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16 }}
            onPress={() => router.push({ pathname: '/restaurant', params: { restaurant: JSON.stringify(item), activeFilters: JSON.stringify(activeFilters)}})}>
            <View style={{ borderRadius: 16, flex: 1, flexDirection: 'row' }}>
                <Image source={item.foodPhotos && item.foodPhotos.length > 0 ? { uri: item.foodPhotos[0] } : []} style={{ width: '30%', height: '100%', borderRadius: 16 }} />
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', ...currentFont }}>{item.name || 'Restaurant Title'}</Text>
                    <Text numberOfLines={2} style={{ fontSize: 12, opacity: 0.7, ...currentFont }}>{item.cuisineType?.map((cuisine: cuisineType) => cuisine.cuisineType).join('/') || 'Miscellaneous'} food such as {meals.length > 0 ? meals.map((meal: Meal) => meal.name).slice(0, 3).join(', ') : '<menu item>'}.</Text>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <Icon
                            name='star'
                            type='font-awesome'
                            iconStyle={favourites.find(f => f === restaurantId) ? styles.filledStar : styles.unfilledStar}
                            onPress={toggleFavourite}
                            size={22}
                        />
                        <Text style={{ fontSize: 11, padding: 5, ...currentFont }}>
                            {favourites.find(f => f === restaurantId)  ? "Favourited!" : "Add to Favourites"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}