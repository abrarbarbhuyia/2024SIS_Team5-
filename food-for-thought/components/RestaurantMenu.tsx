import { View, Linking } from "react-native";
import { Badge, Text } from '@rneui/themed';
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import axios from "axios";
import { currentFont, styles } from "@/styles/app-styles";
import { Meal as MealType, Menu, Restaurant } from "@/constants/interfaces";
import Meal from "./Meal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { formatTextValue, capitaliseFirstLetter } from "@/utils";

interface UserPreferences {
    name: string;
    type: string;
}

export default function RestaurantMenu({ restaurant }: { restaurant: Restaurant }) {
    const menuURL = 'https://irp.cdn-website.com/1efc617b/files/uploaded/takeawaymenu_2021_Aug.pdf';
    
    //const [isMatchingMeal, setIsMatchingMeal] = React.useState(false);
    const [menu, setMenu] = useState<Menu>();
    const [meals, setMeals] = useState<MealType[]>([]);
    //const [setFilter, setSetFilter] = useState(null);
    const [matchingMealsList, setMatchingMealsList] = useState<MealType[]>([]);
    const [otherMealsList, setOtherMealsList] = useState<MealType[]>([]);
    const [cachedMenu, setCachedMenu] = useState<Menu>(); // For caching menu data
    const item = restaurant || {};
    const restaurantId = item.restaurantId;
    const [username, setUsername] = useState<string>();
    const [activeFilters, setActiveFilters] = useState<{ type: string; value: string }[]>([]);
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

    const loadSettings = async () => {
        try {
            const storedFilterByDietary = await AsyncStorage.getItem("filterByDietary");
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
        if (filterByDietary) {
            try {
                await axios
                    .get(`http://${HOST_IP}:4000/user/getUserPreference/${username}`)
                    .then((response) => {
                        if (response.data.length > 0) {
                            setActiveFilters(
                                response.data.map((p: UserPreferences) => ({
                                    type:
                                        p.type === "Cuisine"
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
    const fetchMenu = async (restaurantId: string) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/menu/getMenu/${restaurantId}`);
            const menuData = response.data;
            setMenu(menuData);
            setCachedMenu(menuData);

            if (menuData && menuData[0]?.menuId) {
                fetchMeals(menuData[0].menuId);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    //returns all meals associated with a menu id
    const fetchMeals = async (menuId: string) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${menuId}`);
            setMeals(response.data);
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    };

    const fetchMatchingMeals = async () => {
        try {
            console.log(activeFilters);
            if (activeFilters.length === 0) {
                setMatchingMealsList(meals);
                setOtherMealsList([]);
                return;
            }
            const response = await axios.get(`http://${HOST_IP}:4000/search`, {
                params: {
                    ingredients: (activeFilters?.filter((f) => f.type === "ingredients") || []).map(f => f.value) || [],
                    allergens: (activeFilters?.filter((f) => f.type === "allergens") || []).map(f => f.value) || [],
                    diets: (activeFilters?.filter((f) => f.type === "diets") || []).map(f => f.value) || [],
                    cuisine: (activeFilters?.filter((f) => f.type === "cuisine") || []).map(f => f.value) || [],
                    meals: (activeFilters?.filter((f) => f.type === "meals") || []).map(f => f.value) || [],
                },
            });
            const restaurants = response.data;
            const matchingMenuItemIds = restaurants.flatMap((r: any) => r.menuItemMatches || []);
            console.log(matchingMenuItemIds);

            const matchingMealsList = meals.filter((meal: any) => matchingMenuItemIds.includes(meal.mealId));
            console.log(matchingMealsList);
            const otherMealsList = meals.filter((meal: any) => !matchingMenuItemIds.includes(meal.mealId));

            setMatchingMealsList(matchingMealsList);
            setOtherMealsList(otherMealsList);
        } catch (error: any) {
            console.error(JSON.stringify(error) || "Error searching restaurants. Try again.");
        }
    };

    useEffect(() => {
        fetchMatchingMeals();
    }, [activeFilters, meals]);

    const renderMatchingMeals = () => {
        return matchingMealsList.map((meal) => {    
            return (
                <Meal key={meal.mealId} meal={meal} state={true} />
            );
        });
    };
    

    return (
        <View style={{}}>
            <View style={styles.appliedFilters}>
                <Text style={{...currentFont}}>Filtering by: </Text>
                {activeFilters.length > 0 ? (
                    activeFilters.map((f) => (
                        <Badge
                            badgeStyle={{
                                ...styles.filterBackground,
                                backgroundColor: filterColours[f.type]?.fill ?? "white",
                                borderColor: filterColours[f.type]?.border ?? "white",
                            }}
                            textStyle={styles.filterText}
                            key={`${f.type}-${f.value}`}
                            value={
                                <Text style={styles.filterText}>
                                    {`${f.type === "allergens" ? "No" : ""} ${capitaliseFirstLetter(f.value)}`}
                                    <Icon
                                        name="x"
                                        type="feather"
                                        iconStyle={styles.badgesCross}
                                        size={15}
                                        onPress={() =>
                                            activeFilters.length > 0
                                                ? setActiveFilters(activeFilters.filter((filter) => !(filter === f)))
                                                : null
                                        }
                                    />
                                </Text>
                            }
                        />
                    ))
                ) : (
                    <Text style={{ color: "grey", fontSize: 14, paddingLeft: 5 }}>
                        No filters set
                    </Text>
                )}
            </View>
            <View style={styles.clipboardLink}>
                <Icon name='clipboard-list' type='font-awesome-5' size={22} color={"#A394B8"}/>
                <Text 
                    style={{fontSize: 12, paddingLeft: 15, textDecorationLine: 'underline', ...currentFont }} 
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    onPress={() => Linking.openURL(menuURL)}>{menuURL}
                </Text>
            </View>
            <ScrollView style={{ height: '73%' }}>
                {matchingMealsList.length > 0 ? (
                    <View style={styles.matchingMealsList}>
                        <View style={styles.menuListHeader}>
                            <Text style={{ paddingRight: 15, fontWeight: 'bold', color: '#1D1B20', ...currentFont }}>Matching Meals</Text>
                        </View>
                        {renderMatchingMeals()}
                    </View>
                ) : <View></View>}
                {otherMealsList.length > 0 ? (
                    <View style={styles.otherMealsList}>
                        <View style={styles.menuListHeader}>
                            <Text style={{ paddingRight: 15, fontWeight: 'bold', color: '#1D1B20', ...currentFont }}>Other Meals</Text>
                        </View>
                        {otherMealsList.map((meal) => (
                            <Meal key={meal.mealId} meal={meal} state={undefined} />
                        ))}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
}
const filterColours: { [key: string]: { fill: string; border: string } } = {
    diets: { fill: "#F3D9FF", border: "#D59CEF" },
    allergens: { fill: "#FFDCDC", border: "#FEACAC" },
    ingredients: { fill: "#E4EDFF", border: "#A8C1F3" },
    cuisine: { fill: "#FFF2D9", border: "#FFC56F" },
    meals: { fill: "#DDF8DD", border: "#B5EFB5" },
    selected: { fill: "#E8DEF8", border: "#BDB0CA" },
};