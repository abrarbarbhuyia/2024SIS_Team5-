import { View, StyleSheet, Dimensions, Linking } from "react-native";
import { Card, Text } from '@rneui/themed';
import React from "react";
import { Icon } from "react-native-elements";
import { styles } from "@/styles/app-styles";

// Utility function to convert 2400 time to standard time
const formatTime = (time : any) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;

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
const formatOpeningHours = (openingHours : any) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const groupedHours = {};

    // Initialize all days as "CLOSED"
    daysOfWeek.forEach((day) => {
        groupedHours[day] = "CLOSED";
    });

    // Group time slots by day
    openingHours.forEach(({ day, open, close } : any) => {
        const dayName = daysOfWeek[day - 1]; // Adjust day to index (1 = Monday, etc.)
        const timeSlot = `${formatTime(open)} - ${formatTime(close)}`;

        // If the day is still marked as "CLOSED", replace it with the time slot
        if (groupedHours[dayName] === "CLOSED") {
            groupedHours[dayName] = [timeSlot];
        } else {
            groupedHours[dayName].push(timeSlot);
        }
    });

    return groupedHours;
};


export default function RestaurantDescription({restaurant} : any) {
    const websiteURL = restaurant.website;
    const rating = restaurant.rating / 2;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.4;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const openingHours = restaurant.openingHours || [];
    const groupedOpeningHours = formatOpeningHours(openingHours);

    return (
        <View style={styles.pageContainer}>
            <View style={styles.textDetail}>
                <Text style={{fontWeight: 'bold', fontSize: 12, flexDirection: 'row'}}>{restaurant.cuisineType?.map((cuisine : any) => cuisine.cuisineType).join('/')} Restaurant</Text>
                <Icon name='dot-single' type='entypo' size={15}></Icon>
                <Text style={styles.body}>*distance* kms</Text>
            </View>
            <View style={styles.textDetail}>
                <Text style={styles.body}>Mixed Asian vegetarian meals like san chow pow, in a basic space with simple seating and comfy vibe.</Text>
            </View>
            <View style={styles.textDetail}>
                <Text style={styles.body}>*Count* menu items that match your dietary requirements!</Text>
            </View>
            <View style={styles.ratingsView}>
                <Text style={styles.body}>{rating.toFixed(2)}</Text>
                <View style={{flexDirection: 'row', paddingRight: 10, paddingLeft: 5}}>
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
                    <Icon name='location' type='octicon' size={25} style={{paddingRight: 10}}/>
                    <Text style={styles.body}>{restaurant.address}</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='phone' type='feather' size={25} style={{paddingRight: 10}}/>
                    <Text style={styles.body}>{restaurant.phoneNumber}</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='globe' type='feather' size={25} style={{paddingRight: 10}}/>
                    <Text style={{fontSize: 12, color: 'blue'}} onPress={() => Linking.openURL(websiteURL)}>{websiteURL}</Text>
                </View>
            </View>
            <Text style={{fontSize: 12, fontWeight: 'bold', paddingTop: 5}}>Opening Hours</Text>
            <View style={{paddingTop: 5, paddingLeft: 10}}>
                {Object.entries(groupedOpeningHours).map(([day, times], index) => (
                    <Text key={index} style={{ fontSize: 11, paddingTop: 1 }}>
                        <Text style={{fontWeight: 'bold'}}>{day}: </Text> {Array.isArray(times) ? times.join(', ') : times}
                    </Text>
                ))}
            </View>
        </View>
    )
}