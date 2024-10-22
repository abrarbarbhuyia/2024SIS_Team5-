import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text, Icon } from '@rneui/themed';
import { useEffect, useState } from "react";
import axios from "axios";
import Constants from 'expo-constants';
import { cuisineType, Meal, Menu, Restaurant } from '@/constants/interfaces';

export default function RecommendedRestaurant({ restaurant }: { restaurant: Restaurant }) {

    const [isFavourite, setIsFavourite] = useState<boolean>(false);
    const [menu, setMenu] = useState<Menu>();
    const [meals, setMeals] = useState<Meal[]>([]);
    const item = restaurant || {};
    const restaurantId = item.restaurantId;

    const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

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

    const toggleFavourite = () => {
        setIsFavourite((prev) => !prev);
        isFavourite ? console.log("Unfavourited " + item.name) : console.log("Favourited " + item.name);
        //store favourited restaurant
    };

    return (
        <TouchableOpacity
            style={{ height: '42%', padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16 }}
            onPress={() => router.push({ pathname: '/restaurant', params: { restaurant: JSON.stringify(item) } })}>
            <View style={{ borderRadius: 16, flex: 1, flexDirection: 'row' }}>
                <Image source={item.foodPhotos && item.foodPhotos.length > 0 ? { uri: item.foodPhotos[0] } : []} style={{ width: '30%', height: '100%', borderRadius: 16 }} />
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name || 'Restaurant Title'}</Text>
                    <Text numberOfLines={2} style={{ fontSize: 12, opacity: 0.7 }}>{item.cuisineType?.map((cuisine: cuisineType) => cuisine.cuisineType).join('/') || 'Delicious'} food such as {meals.length > 0 ? meals.map((meal: Meal) => meal.name).slice(0, 3).join(', ') : '<menu item>'}.</Text>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <Icon
                            name={isFavourite ? "star" : "star-outlined"}
                            type="entypo"
                            size={25}
                            onPress={toggleFavourite}
                            color={isFavourite ? '#FCBE09' : 'black'}
                        />
                        <Text style={{ fontSize: 11, padding: 5 }}>
                            {isFavourite ? "Favourited!" : "Add to Favourites"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}