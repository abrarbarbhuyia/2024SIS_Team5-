import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Text, Icon } from '@rneui/themed';      
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { currentFont, styles } from "@/styles/app-styles";

export default function RecommendedRestaurant({restaurant} : any) {

    const [isFavourite, setIsFavourite] = useState(false);
    const [menu, setMenu] = useState(null);
    const [meals, setMeals] = useState([]);
    const item = restaurant || {};
    const restaurantId = item.restaurantId;

    const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

    useEffect(() => {
        if (restaurantId) {
            fetchMenu(restaurantId);
        }
    }, [restaurantId]);

    //fetch menu using restaurantId
    const fetchMenu = async (restaurantId : any) => {
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

    const fetchMeals = async (menuId : any) => {
        try {
            const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${menuId}`);
            setMeals(response.data);
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    };

    const toggleFavourite = () => {
        setIsFavourite((prev) => !prev);
        isFavourite ? console.log("Unfavourited " + item.name) : console.log("Favourited " + item.name);
        //store favourited restaurant
    };

    return (
        <TouchableOpacity 
            style={{height: '42%', padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16}} 
            onPress={() => router.push({pathname: '/restaurant', params: {restaurant: JSON.stringify(item)}})}>
            <View style={{borderRadius: 16, flex: 1, flexDirection: 'row'}}>
                <Image source={ item.foodPhotos && item.foodPhotos.length > 0 ? { uri: item.foodPhotos[0]} : []} style={{width: '30%', height: '100%', borderRadius: 16}} />
                <View style={{flex: 1, flexDirection: 'column', paddingLeft: 10}}>
                    <Text style={{fontSize: 18, fontWeight: '600', ...currentFont}}>{item.name || 'Restaurant Title'}</Text>
                    <Text numberOfLines={2} style={{fontSize: 12, opacity: 0.7, ...currentFont}}>{item.cuisineType?.map((cuisine : any) => cuisine.cuisineType).join('/') || 'Delicious'} food such as {meals.length > 0 ? meals.map((meal : any) => meal.name).slice(0, 3).join(', ') : '<menu item>'}.</Text>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>  
                        <Icon
                            name='star'
                            type='font-awesome'
                            iconStyle={isFavourite ? styles.filledStar : styles.unfilledStar}
                            size={22}
                        />
                        <Text style={{ fontSize: 11, padding: 5, ...currentFont }}>
                            {isFavourite ? "Favourited!" : "Add to Favourites"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}