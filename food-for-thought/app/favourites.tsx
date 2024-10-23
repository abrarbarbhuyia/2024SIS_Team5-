import Header from "@/components/Header";
import { View, Image, TouchableOpacity } from "react-native";
import { Icon, Text, Overlay, Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React from "react";
import { styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';
import { getDistance } from 'geolib';
import { router } from "expo-router";
import { Restaurant } from "./map";

const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

export type Favourite = {
    longitude: string,
    latitude: string,
    imageUrl: string,
    name: string,
    cuisines: string[],
    restaurantId: string
}
export default function Favourites() {
    const [username, setUsername] = React.useState<string>();
    const [favourites, setFavourites] = React.useState<Favourite[]>([]);
    const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
    const [favouriteToRemove, setFavouriteToRemove] = React.useState<Favourite>();
    // initial region is hardcoded to UTS Tower
    const [userLocation, setUserLocation] = React.useState<{ latitude: number, longitude: number }>({
        latitude: -33.88336558611229,
        longitude: 151.2009263036271,
    })

    const fetchRestaurants = async () => {
        const restaurantUrl = `http://${HOST_IP}:4000/restaurant/getRestaurants/`;
        await axios.get(restaurantUrl)
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => console.error("Error fetching all restaurants", error)
            );
    }

    const loadUser = React.useCallback(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUsername(decodedToken.username);
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, []);

    React.useEffect(() => {
        loadUser();
    }, [loadUser]);

    const fetchFavourites = async () => {
        const url = `http://${HOST_IP}:4000/user/getUser/${username}`;
        await axios.get(url)
            .then(response => {
                const userDetails = response.data;
                const favouritesArray = userDetails[0].favourites ?? [];
                setFavourites(favouritesArray.map((f: Favourite) => {
                    const restaurant = restaurants?.find((r: any) => f == r.restaurantId);
                    return restaurant && {
                        restaurantId: restaurant.restaurantId,
                        latitude: restaurant.latitude,
                        longitude: restaurant.longitude,
                        imageUrl: restaurant.foodPhotos?.[0] ?? "https://reactjs.org/logo-og.png",
                        name: restaurant.name,
                        cuisines: restaurant.cuisineType?.map((c: any) => c.cuisineType) ?? []
                    }
                }))
            })
            .catch(error => console.error("Error fetching the favourites", error));
    }
    const deleteFavourite = async (favourite: Favourite) => {
        const url = `http://${HOST_IP}:4000/user/deleteFavourite/${username}/${favourite.restaurantId}`;
        await axios.delete(url)
            .then(() => setFavourites(favourites.filter(f => f.restaurantId !== favourite.restaurantId)))
            .catch(e => console.log('Error removing the Favourite ', e));
    }

    React.useEffect(() => {
        if (username && restaurants.length > 0) {
            fetchFavourites();
        }
    }, [restaurants, username]); // when the restaurant variable is modified, the useEffect is called

    React.useEffect(() => {
        fetchRestaurants();
    }, [username]);

    const calculateRestaurantDistance = (userLocation: { latitude: number, longitude: number }, latitude: string, longitude: string) => {
        const restaurantLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        const distanceInMeters = getDistance(userLocation, restaurantLocation);
        return (distanceInMeters / 1000).toFixed(2);
    }

    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }} >
            <Header />
            <View style={{ paddingTop: 70 }}>
                <Text style={styles.subtitle}>Favourites</Text>
                <Text style={styles.userText}>A list of your favourite restaurants</Text>
                {favourites && favourites.length > 0 ? <View style={{ ...styles.rectangle, shadowOpacity: 0.2, marginTop: 35 }}>
                    {favourites.map(f =>
                        <View key={f.restaurantId} style={{ flexDirection: 'row', height: 80 }}>
                            <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 15, flex: 1, justifyContent: 'center', marginTop: -8 }}>
                                    <Icon
                                        name='star'
                                        type='font-awesome'
                                        size={28}
                                        iconStyle={styles.filledStar}
                                    />
                                </ View>
                            </View>
                            <TouchableOpacity style={{ minWidth: '80%', flex: 1, flexDirection: 'row' }} onPress={() => router.push({ pathname: '/restaurant', params: { restaurant: JSON.stringify(restaurants.find(r => r.restaurantId === f.restaurantId)) } })}>
                                <View style={{ flex: 1.5, flexDirection: 'column' }}>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Image source={{ uri: f.imageUrl }} style={{ borderRadius: 16, width: 70, height: 70 }} />
                                    </ View>
                                </View>
                                <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start', gap: 2, paddingLeft: 4 }}>
                                    <Text style={styles.noteTitle}>{f.name}</Text>
                                    <Text style={styles.userText}>{f.cuisines && f.cuisines.length > 0 ? f.cuisines.join(', ') : 'Other'}</Text>
                                    <Text style={styles.userText}>Open Now</Text>
                                    <Text style={styles.userText}>{userLocation && calculateRestaurantDistance(userLocation, f.latitude, f.longitude)} km away</Text>
                                </View>
                                <View style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start', gap: 2, paddingLeft: 5 }}>
                                    <Icon
                                        name='x'
                                        type='feather'
                                        iconStyle={styles.modalIcon}
                                        size={20}
                                        onPress={() => setFavouriteToRemove(f)} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    {favouriteToRemove && <Overlay
                        overlayStyle={{ ...styles.modal }}
                        isVisible={favouriteToRemove !== undefined}
                        onBackdropPress={() => setFavouriteToRemove(undefined)}>
                        <View style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ ...styles.formHeaderText, paddingBottom: 20 }}>Confirm Removal</Text>
                            <Text style={styles.userText}>Are you sure you want to remove {favouriteToRemove.name} from your favourites?</Text>
                            <Button buttonStyle={{ ...styles.button, paddingHorizontal: 25, marginTop: 20 }}
                                titleStyle={{ ...styles.buttonTitle, fontSize: 12 }}
                                onPress={() => {
                                    deleteFavourite(favouriteToRemove);
                                    setFavouriteToRemove(undefined);
                                }} 
                                title={('unfavourite').toUpperCase()} />
                        </View>
                    </Overlay>}
                </View>
                    : <View style={{ paddingTop: 20 }}><Text>Please add favourites from the restaurant finder page.</Text></View>
                }
            </View>
        </View>
    )
}