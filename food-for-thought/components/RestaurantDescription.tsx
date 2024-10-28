import { View, Linking } from "react-native";
import { Text } from '@rneui/themed';
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { currentFont, styles } from "@/styles/app-styles";
import { cuisineType, openingHours, Restaurant } from "@/constants/interfaces";
import { getDistance } from 'geolib';

// Utility function to convert 2400 time to standard time
const formatTime = (time: string) => {
    const hours = Math.floor(parseFloat(time) / 100);
    const minutes = parseFloat(time) % 100;

    // Format hours and minutes
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const ampm = hours < 12 ? 'am' : 'pm';

    // Only show minutes if they are non-zero
    if (minutes > 0) {
        return `${formattedHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    } else {
        return `${formattedHours}${ampm}`;
    }
};

// Group opening hours by day and format them
const formatOpeningHours = (openingHours: openingHours[]) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const groupedHours: { [key: string]: string | string[] } = {};

    // Initialize all days as "CLOSED"
    daysOfWeek.forEach((day: string) => {
        groupedHours[day] = "CLOSED";
    });

    // Group time slots by day
    openingHours.forEach(({ day, open, close }: openingHours) => {
        const dayName = daysOfWeek[day - 1]; // Adjust day to index (1 = Monday, etc.)
        const timeSlot = `${formatTime(open)} - ${formatTime(close)}`;

        // If the day is still marked as "CLOSED", replace it with the time slot
        if (groupedHours[dayName] === "CLOSED") {
            groupedHours[dayName] = [timeSlot];
        } else {
            (groupedHours[dayName] as string[]).push(timeSlot);
        }
    });

    return groupedHours;
};

//calculate distance from user to restuarant
const calculateRestaurantDistance = (userLocation: { latitude: number, longitude: number }, latitude: string, longitude: string) => {
    const restaurantLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const distanceInMeters = getDistance(userLocation, restaurantLocation);
    return (distanceInMeters / 1000).toFixed(2);
};

export default function RestaurantDescription({ restaurant }: { restaurant: Restaurant }) {
    const websiteURL = restaurant.website;
    const rating = restaurant.rating / 2;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.4;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const openingHours: openingHours[] = restaurant.openingHours || [];
    const groupedOpeningHours = formatOpeningHours(openingHours);

    // initial region is hardcoded to UTS Tower
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number }>({
        latitude: -33.88336558611229,
        longitude: 151.2009263036271,
    })

    return (
        <View style={{padding: 15}}>
            <View style={styles.textDetail}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, flexDirection: 'row', ...currentFont }}>
                    {restaurant.cuisineType && restaurant.cuisineType.length > 0 ? (
                        restaurant.cuisineType.map((cuisine: cuisineType) => cuisine.cuisineType).join('/')
                    ) : (
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Miscellaneous</Text>
                    )}
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}> Restaurant</Text>
                </Text>
                <Icon name='dot-single' type='entypo' size={15}></Icon>
                <Text style={styles.body}>{calculateRestaurantDistance(userLocation, restaurant.latitude, restaurant.longitude)} kms</Text>
            </View>
            <View style={styles.textDetail}>
                <Text style={styles.body}>{restaurant.menuItemMatches ? restaurant.menuItemMatches.length : 0} menu items that match your dietary requirements!</Text>
            </View>
            <View style={styles.ratingsView}>
                <Text style={styles.body}>{rating.toFixed(2)}</Text>
                <View style={{ flexDirection: 'row', paddingRight: 10, paddingLeft: 5 }}>
                    {/* Render Full Stars */}
                    {Array(fullStars).fill(0).map((_, i) => (
                        <Icon key={`full-${i}`} name='star' type='font-awesome' size={18} color='#FCBE09' />
                    ))}
                    {/* Render Half Star (if applicable) */}
                    {halfStar && <Icon name='star-half-full' type='font-awesome' size={18} color='#FCBE09' />}
                    {/* Render Empty Stars */}
                    {Array(emptyStars).fill(0).map((_, i) => (
                        <Icon key={`empty-${i}`} name='star' type='font-awesome' size={18} color='#D3D3D3' />
                    ))}
                </View>
                <Text style={styles.body}>({restaurant.total_ratings})</Text>
            </View>
            <View style={styles.contactCard}>
                <View style={styles.contactInformation}>
                    <Icon name='location' type='octicon' size={25} style={{ paddingRight: 10 }} />
                    <Text style={styles.body}>{restaurant.address}</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='phone' type='feather' size={25} style={{ paddingRight: 10 }} />
                    <Text style={styles.body}>{restaurant.phoneNumber}</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='globe' type='feather' size={25} style={{ paddingRight: 10 }} />
                    <Text style={{ fontSize: 12, color: 'blue', ...currentFont }} onPress={() => Linking.openURL(websiteURL)}>{websiteURL}</Text>
                </View>
            </View>
            <Text style={{ fontSize: 12, fontWeight: 'bold', paddingTop: 5, ...currentFont }}>Opening Hours</Text>
            <View style={{ paddingTop: 5, paddingLeft: 10 }}>
                {Object.entries(groupedOpeningHours).map(([day, times], index) => (
                    <Text key={index} style={{ fontSize: 11, paddingTop: 1, ...currentFont }}>
                        <Text style={{ fontWeight: 'bold', ...currentFont }}>{day}: </Text> {Array.isArray(times) ? times.join(', ') : times}
                    </Text>
                ))}
            </View>
        </View>
    )
}