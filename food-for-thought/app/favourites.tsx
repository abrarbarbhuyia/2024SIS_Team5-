import { View, Image, TouchableOpacity } from "react-native";
import { Icon, Text, Overlay, Button, Badge, Card } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { currentFont, styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';
import { getDistance } from 'geolib';
import { router } from "expo-router";
import { calculateCategories, isRestaurantOpen } from "@/components/RestaurantModal";
import Layout from "@/components/Layout";
import { Restaurant, Favourite, cuisineType, UserPreferences } from "@/constants/interfaces";
import useLoadUser from '@/hooks/useLoadUser';
import { formatTextValue } from "@/utils";

const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

export default function Favourites() {
    const { username, loadUser } = useLoadUser();
    const [favourites, setFavourites] = React.useState<Favourite[]>([]);
    const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
    const [favouriteToRemove, setFavouriteToRemove] = React.useState<Favourite>();
    const [activeFilters, setActiveFilters] = useState<
        { type: string; value: string }[]
    >([]);
    const [filterByDietary, setFilterByDietary] = useState<boolean>(false);
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

    React.useEffect(() => {
        loadUser();
        loadSettings();
    }, [loadUser, username]);

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

    const fetchFavourites = async () => {
        const url = `http://${HOST_IP}:4000/user/getUser/${username}`;
        await axios.get(url)
            .then(response => {
                const userDetails = response.data;
                const favouritesArray: string[] = userDetails[0].favourites ?? [];
                setFavourites(favouritesArray.map((f: string) => {
                    const restaurant = restaurants?.find((r: Restaurant) => f == r.restaurantId);
                    return restaurant && {
                        restaurantId: restaurant.restaurantId,
                        latitude: restaurant.latitude,
                        longitude: restaurant.longitude,
                        imageUrl: restaurant.foodPhotos?.[0] ?? "https://reactjs.org/logo-og.png",
                        name: restaurant.name,
                        isOpen: restaurant.openingHours ? isRestaurantOpen(restaurant.openingHours).isOpen : false,
                        cuisines: restaurant.cuisineType?.map((c: cuisineType) => c.cuisineType) ?? [],
                        restaurantTypes: restaurant.restaurantType?.map(r => r.restaurantType) ?? []
                    }
                }) as Favourite[])
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
        <Layout>
            <View style={{ ...styles.pageContainer, justifyContent: 'flex-start' }} >
                <View style={{ ...styles.detailsContainer }}>
                    <Text h3 style={{ color: "#1D1B20", fontWeight: "600", ...currentFont }}>Favourites</Text>
                    <Text style={styles.userText}>A list of your favourite restaurants</Text>
                    {favourites && favourites.length > 0 ? <Card containerStyle={{ ...styles.rectangle, marginTop: 20, paddingVertical: 5, paddingHorizontal: 0, alignItems: 'stretch'}}>
                        {favourites.map((f, i) =>
                            <View key={f.restaurantId} style={{ flexDirection: 'row', paddingVertical: 10, ...(favourites.length - 1 !== i && {borderBottomWidth: 1, borderBottomColor: '#EEE'})}}>
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
                                <TouchableOpacity style={{ minWidth: '80%', flex: 1, flexDirection: 'row', paddingTop: 5 }} onPress={() => router.push({ pathname: '/restaurant', params: { restaurant: JSON.stringify(restaurants.find(r => r.restaurantId === f.restaurantId)), activeFilters: JSON.stringify(activeFilters)}})}>
                                    <View style={{ flex: 1.5, flexDirection: 'column' }}>
                                        <View style={{ paddingHorizontal: 10 }}>
                                            <Image source={{ uri: f ? f.imageUrl : '' }} style={{ borderRadius: 16, width: 70, height: 70 }} />
                                        </ View>
                                    </View>
                                    <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 4 }}>
                                        <Text numberOfLines={1} style={styles.noteTitle}>{f.name}</Text>
                                        <Badge
                                            badgeStyle={{
                                                backgroundColor: f.isOpen ? '#16D59C' : '#E03F43',
                                                height: 15,
                                                borderStyle: 'solid',
                                                borderColor: f.isOpen ? '#16D59C' : '#F02929',
                                            }}
                                            value={f.isOpen ? 'Open' : 'Closed'}
                                            textStyle={{ ...styles.badgeText, fontSize: 10, fontWeight: '600', ...currentFont }}
                                        />
                                        <Text style={{...styles.userText, paddingTop: 1, marginBottom: -2}}>{calculateCategories(f.cuisines, f.restaurantTypes) ?? 'Other'}</Text>
                                        <Text style={styles.userText}>{userLocation && calculateRestaurantDistance(userLocation, f.latitude, f.longitude)} km away</Text>
                                    </View>
                                    <View style={{ flex: 0.8, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 5 }}>
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
                    </Card>
                        : <View style={{ paddingTop: 20 }}><Text>Please add favourites from the restaurant finder page.</Text></View>
                    }
                </View>
            </View>
        </Layout>
    )
}