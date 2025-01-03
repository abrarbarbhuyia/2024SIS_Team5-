import { Card, Icon } from '@rneui/themed';
import { View, StyleSheet, Dimensions } from "react-native";
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect, usePathname } from 'expo-router';
import logo from '../assets/images/logo.png';        

export default function Header() {
    const isNotHomepage = usePathname() !== '/home';
    const [showBackButton, setShowBackButton] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setShowBackButton(isNotHomepage);
        }, [isNotHomepage])
    );

    const handleHomeRoute = () => {
        if (isNotHomepage) {
            router.push('/home');
        }
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.headerCard}>
                <View style={styles.headerContent}>
                    <View style={styles.leftIcons}>
                        {showBackButton && (
                            <Icon style={{ color: '#000000' }} name='arrow-back' type='material' size={35} onPress={() => router.back()}/>
                        )}
                    </View>

                    <View style={styles.logoContainer}>
                        <Card.Image source={logo} style={styles.image} onPress={handleHomeRoute}/>
                    </View>

                    <View style={styles.rightIcons}>
                        <Icon style={{ color: '#000000' }} name='account-circle' type='material' size={35} onPress={() => router.push('/user')}/>
                        <Icon style={{ color: '#000000', marginTop: 4, marginLeft: 4 }} name='spinner-cog' type='fontisto' size={25} onPress={() => router.push('/settings')}/>
                    </View>
                </View>
            </Card>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 150,
        alignItems: 'center',
        paddingBottom: 5
    },
    headerCard: {
        width: width - 32,
        height: 85,
        backgroundColor: "#FBF8FF",
        padding: 12,
        borderRadius: 24,
        marginTop: 40,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
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
    },
    logoContainer: {
        flex: 0,
        alignItems: 'center',
    },
    rightIcons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    image: {
        width: 135,
        height: 59,
    },
});