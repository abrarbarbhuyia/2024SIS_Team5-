import { Card, Text, Icon } from '@rneui/themed';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import React from 'react';
import { router } from 'expo-router';
import logo from '../assets/images/logo.png';        

export default function Header({homepage=false}) {

    //dont want to clear stack if already at homepage (top of stack)
    //dont need to pass in prop in any other page as false default is expected functionality
    const handleHomeRoute = () => {
        if (!homepage) {
            router.dismissAll();
        }
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.headerCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 35, marginTop: 7 }}>
                        <Icon style={{ color: '#000000' }} name='user' type='evilicon' size={35} onPress={() => router.push('/login')}/>
                        <Text style={{ marginLeft: 8 }}>Nep</Text>
                    </View>
                    {/* <Icon name='user' type='evilicon' /> */}
                    {/* also some text alongside the icon */}
                    <Card.Image source={logo} style={styles.image} onPress={handleHomeRoute}/>
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
        maxHeight: 150,
    },
    headerCard: {
        width: width - 32,
        height: 85,
        backgroundColor: "#FBF8FF",
        padding: 12,
        borderRadius: 24,
        marginTop: 40,
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        justifyContent: "space-between",
        flexWrap: 'nowrap',
    },
    image: {
        width: 135,
        height: 59,
        marginBottom: 6,
    }
})