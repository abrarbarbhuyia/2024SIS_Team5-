import Header from "@/components/Header";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text } from '@rneui/themed';
import React from "react";
import { ButtonGroup } from "react-native-elements";
import RestaurantGallery from "@/components/RestaurantGallery";
import RestaurantDescription from "@/components/RestaurantDescription";
import RestaurantMenu from "@/components/RestaurantMenu";
import { useLocalSearchParams } from "expo-router";
import Layout from "@/components/Layout";

export default function Restaurant() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    //need to get the restaurant data from path route - object was stringified
    const {restaurant} = useLocalSearchParams();
    const restaurantData = JSON.parse(restaurant);

    // Components to load based on selected index, passes restaurant data
    const renderContent = () => {
        switch (selectedIndex) {
            case 0:
                return <RestaurantMenu restaurant={restaurantData}/>;
            case 1:
                return <RestaurantDescription restaurant={restaurantData}/>;
            case 2:
                return <RestaurantGallery restaurant={restaurantData}/>;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <View style={styles.detailsContainer}>
                <Text h4 style={{padding: 15,}}>{restaurantData.name}</Text>
                <Card containerStyle={styles.tabContainer}>
                <ButtonGroup
                    buttonStyle={{  backgroundColor: '#FBF8FF' }}
                    selectedButtonStyle={{ backgroundColor: '#E8DEF8' }}
                    buttons={[
                    <Text>Menu</Text>,
                    <Text>Description</Text>,
                    <Text>Gallery</Text>
                    ]}
                    selectedIndex={selectedIndex}
                    onPress={setSelectedIndex}
                    containerStyle={{borderTopStartRadius: 16, borderTopEndRadius: 16, borderWidth: 0, height: 50}}
                />
                <Card.Divider/>
                {/* load in page component or sumn based on selected button? */}
                {renderContent()}
                </Card>
            </View>
        </Layout>
    )
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "#E6D7FA",
        flex: 1,
    },
    detailsContainer: {
        alignItems: 'center',
        backgroundColor: '#F5EEFF',
        paddingTop: 10,
        width: width,
        height: height,
        flex: 1,
    },
    tabContainer: {
        flex: 1,
        backgroundColor: '#FBF8FF',
        width: width - 32,
        padding: 2,
        paddingTop: 0,
        borderRadius: 24,
        marginTop: 5,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        marginBottom: 15,
    },
})