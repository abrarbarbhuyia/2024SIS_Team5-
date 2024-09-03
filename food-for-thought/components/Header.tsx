import { Card, Text, Icon } from '@rneui/themed';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import React from 'react';
import logo from '../assets/images/logo.png';

export default function Header() {

    const handleHomePress = () => {
        //navigate to home page, prob need to clear stack of pages?
        console.log("Home click");
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.headerCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 35, marginTop: 7 }}>
                        <Icon style={{ color: '#000000' }} name='user' type='evilicon' size={35} onPress={() => console.log("Profile click")}/>
                        <Text style={{ marginLeft: 8 }}>Nep</Text>
                    </View>
                    {/* <Icon name='user' type='evilicon' /> */}
                    {/* also some text alongside the icon */}
                    <Card.Image source={logo} style={styles.image} onPress={handleHomePress}/>
                    {/* now two more icons on other side of logo, side by side */}
                    <View style={{ flexDirection: 'row', marginLeft: 35, marginTop: 10}}>
                        <Icon style={{ color: '#000000', marginRight: 20 }} name='bell' type='fontisto' size={25} onPress={() => console.log("Notifications click")}/>
                        <Icon style={{ color: '#000000' }} name='spinner-cog' type='fontisto' size={25} onPress={() => console.log("Settings click")}/>
                    </View>
                </View>
            </Card>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    headerCard: {
        width: width - 32,
        height: 100,
        backgroundColor: "#FBF8FF",
        padding: 12,
        borderRadius: 24,
        marginTop: 40,
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        justifyContent: "space-between",
    },
    image: {
        width: 135,
        height: 59,
        marginBottom: 6,
    }
})