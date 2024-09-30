import { View, StyleSheet, Dimensions, Linking } from "react-native";
import { Card, Text } from '@rneui/themed';
import React from "react";
import { Icon } from "react-native-elements";
import { Link } from "expo-router";

export default function RestaurantDescription() {
    const websiteURL = 'https://www.restaurantwebsite.com.au/';

    return (
        <View style={styles.pageContainer}>
            <View style={styles.textDetail}>
                <Text style={{fontWeight: 'bold', fontSize: 12}}>*Cuisine* Restuarant</Text>
                <Icon name='dot-single' type='entypo' size={15}></Icon>
                <Text style={styles.body}>$20 - 40pp</Text>
                <Icon name='dot-single' type='entypo' size={15}></Icon>
                <Text style={styles.body}>1.2 miles away</Text>
            </View>
            <View style={styles.textDetail}>
                <Text style={styles.body}>Mixed Asian vegetarian meals like san chow pow, in a basic space with simple seating and comfy vibe.</Text>
            </View>
            <View style={styles.textDetail}>
                <Text style={styles.body}>*Count* menu items that match your dietary requirements!</Text>
            </View>
            <View style={styles.ratingsView}>
                <Text style={styles.body}>4.3</Text>
                <View style={{flexDirection: 'row', paddingRight: 10, paddingLeft: 5}}>
                <Icon name='star' type='entypo' size={18} color='#FCBE09'></Icon>
                <Icon name='star' type='entypo' size={18} color='#FCBE09'></Icon>
                <Icon name='star' type='entypo' size={18} color='#FCBE09'></Icon>
                <Icon name='star' type='entypo' size={18} color='#FCBE09'></Icon>
                <Icon name='star' type='entypo' size={18} color='#FCBE09'></Icon>
                </View>
                <Text style={styles.body}>(563)</Text>
            </View>
            <View style={styles.contactCard}>
                <View style={styles.contactInformation}>
                    <Icon name='location' type='octicon' size={25} style={{paddingRight: 10}}/>
                    <Text style={styles.body}>367 Pitt Street, Sydney NSW 2000</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='phone' type='feather' size={25} style={{paddingRight: 10}}/>
                    <Text style={styles.body}>(02) 9283 2828</Text>
                </View>
                <View style={styles.contactInformation}>
                    <Icon name='globe' type='feather' size={25} style={{paddingRight: 10}}/>
                    <Text style={{fontSize: 12, color: 'blue'}} onPress={() => Linking.openURL(websiteURL)}>{websiteURL}</Text>
                </View>
            </View>
            <Text style={{fontSize: 12, fontWeight: 'bold', paddingTop: 5}}>Opening Hours</Text>
            <View style={{paddingLeft: 30, paddingTop: 5}}>
                <Text style={styles.body}>Monday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Tuesday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Wednesday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Thursday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Friday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Saturday: 12-3pm, 5-9pm</Text>
                <Text style={styles.body}>Sunday: 12-3pm, 5-9pm</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        padding: 15,
        justifyContent: 'space-between',
        
    },
    textDetail: {
        paddingBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingsView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactCard: {
        paddingTop: 20,
    },
    contactInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    body: {
        fontSize: 12,
    }
})