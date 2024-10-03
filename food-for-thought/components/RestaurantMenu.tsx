import { View, StyleSheet, Linking } from "react-native";
import { Card, Text } from '@rneui/themed';
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Meal from "./Meal";

export default function RestaurantMenu({restaurant}) {
    const menuURL = 'https://irp.cdn-website.com/1efc617b/files/uploaded/takeawaymenu_2021_Aug.pdf';
    
    const [isMatchingMeal, setIsMatchingMeal] = React.useState(false);

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
                    {/* any number of 'matching meals' */}
                    <Meal/>
                    <Meal/>

                </View>
                <View style={styles.otherMealsList}>
                    <View style={styles.menuListHeader}>
                        <Text style={{paddingRight: 15, fontWeight: 'bold'}}>Other Meals</Text> 
                    </View>
                    {/* any number of 'other meals' */}
                    <Meal/>
                    <Meal/>
                    <Meal/>
                    <Meal/>
                    <Meal/>
                    <Meal/>
                    <Meal/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    appliedFilters: {
        flexDirection: 'row',
        paddingLeft: 20,
    },
    clipboardLink: {
        flexDirection: 'row',
        padding: 20,
        paddingLeft: 25,
        paddingBottom: 10,
        alignItems: 'center',
    },
    menuListHeader: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    matchingMealsList: {
        backgroundColor: '#CFFFF150',
    },
    otherMealsList: {

    },
})