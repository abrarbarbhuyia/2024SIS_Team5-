import { Card, Icon } from '@rneui/themed';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import React from 'react';
import { router } from 'expo-router';
import logo from '../assets/images/logo.png';        

export default function Header({homepage=false}) {

    //dont want to clear stack if already at homepage (top of stack)
    //dont need to pass in prop in any other page as false default is expected functionality
    const handleHomeRoute = () => {
        if (!homepage) {
            router.push('/home');
        }
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.headerCard}>
                <View style={styles.headerContent}>
                    <View style={styles.leftIcons}>
                        <Icon style={{ color: '#000000' }} name='account-circle' type='material' size={35} onPress={() => router.push('/user')}/>
                    </View>

                    <View style={styles.logoContainer}>
                        <Card.Image source={logo} style={styles.image} onPress={handleHomeRoute}/>
                    </View>

                    <View style={styles.rightIcons}>
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
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftIcons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 7,
    },
    logoContainer: {
        flex: 0,
        alignItems: 'center',
    },
    rightIcons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    image: {
        width: 135,
        height: 59,
    },
});