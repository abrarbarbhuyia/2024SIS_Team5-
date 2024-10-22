import { View, StyleSheet, Linking } from "react-native";
import { Card, Text } from '@rneui/themed';
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Meal from "./Meal";
import Constants from "expo-constants";
import axios from "axios";
import { styles } from "@/styles/app-styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { formatTextValue } from "@/utils";

interface UserPreferences {
    name: string;
    type: string;
  }

export default function RestaurantMenu({restaurant} : any) {
    const menuURL = 'https://irp.cdn-website.com/1efc617b/files/uploaded/takeawaymenu_2021_Aug.pdf';
    
    //const [isMatchingMeal, setIsMatchingMeal] = React.useState(false);
    const [menu, setMenu] = useState(null);
    const [meals, setMeals] = useState([]);
    //const [setFilter, setSetFilter] = useState(null);
    const [cachedMenu, setCachedMenu] = useState<any>(null); // For caching menu data
    const item = restaurant || {};
    const restaurantId = item.restaurantId;
    const [username, setUsername] = useState<string>();
    const [activeFilters, setActiveFilters] = useState<
        { type: string; value: string }[]
    >([]);
    const [filterByDietary, setFilterByDietary] = useState<boolean>(false);

    const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

    console.log("Filtersssssssssss", activeFilters);


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
        if (!cachedMenu && restaurantId) {
            fetchMenu(restaurantId);
        }
    }, [restaurantId, cachedMenu]);

    //fetch menu using restaurantId
    const fetchMenu = async (restaurantId : any) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/menu/getMenu/${restaurantId}`);
            const menuData = response.data;
            setMenu(menuData);
            setCachedMenu(menuData); 

            if (menuData && menuData[0]?.menuId) {
                fetchMeals(menuData[0].menuId); //fetch meals from menuId, returns full list
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    //returns all meals associated with a menu id
    const fetchMeals = async (menuId : any) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${menuId}`);
            setMeals(response.data);
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    };

    //idk how does the filtering stuff work? using this just to test
    // const isMealMatching = (meal : any) => {
    //     if (setFilter && meal.ingredients) {
    //         return meal.ingredients.some((ingredient : any) => ingredient.includes(setFilter));
    //     }
    //     return false;
    // };

    return (
        <View style={{}}>
            <View style={styles.appliedFilters}>
                <Text>Filtering by: </Text>
            </View>
            {/* insert a link here but not sure what for */}
            <View style={styles.clipboardLink}>
                <Icon name='clipboard-list' type='font-awesome-5' size={22}/>
                <Text 
                    style={{fontSize: 12, paddingLeft: 15, textDecorationLine: 'underline', }} 
                    numberOfLines={1}
                    ellipsizeMode="tail" 
                    onPress={() => Linking.openURL(menuURL)}>{menuURL}
                </Text>
            </View>
            <ScrollView style={{ height: '73%'}}>
                <View style={styles.matchingMealsList}>
                    <View style={styles.menuListHeader}>
                        <Text style={{paddingRight: 15, fontWeight: 'bold'}}>Matching Meals</Text>
                        <Icon name='check-circle' type='feather' size={20} color={'#16D59C'}/>
                    </View>
                    {/* {meals.filter(isMealMatching).map((meal) => (
                        <Meal key={meal.mealId} meal={meal}/>
                    ))} */}
                    <Meal meal={meals[0]}/>
                    <Meal meal={meals[1]}/>

                </View>
                <View style={styles.otherMealsList}>
                    <View style={styles.menuListHeader}>
                        <Text style={{paddingRight: 15, fontWeight: 'bold'}}>Other Meals</Text> 
                    </View>
                    {meals.map((meal) => (
                        <Meal key={meal.mealId} meal={meal}/>
                    ))}
                    {/* {meals.filter((meal) => !isMealMatching(meal)).map((meal) => (
                        <Meal key={meal.mealId} meal={meal}/>
                    ))} */}
                </View>
            </ScrollView>
        </View>
    )
}