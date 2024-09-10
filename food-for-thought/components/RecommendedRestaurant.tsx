import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text, Icon } from '@rneui/themed';
import pic from '../assets/images/react-logo.png';        
import { useState } from "react";

export default function RecommendedRestaurant() {

    const [isFavourite, setIsFavourite] = useState(false);

    const toggleFavourite = () => {
        setIsFavourite((prev) => !prev);
        console.log("favourited");
    };

    return (
        <TouchableOpacity style={{padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16}} onPress={() => router.push('/restaurant')}>
            <View style={{flexDirection: 'row'}}>
                <Image source={pic} />
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Restaurant Title</Text>
                    <Text style={{fontSize: 13}}>Restaurant blurb/quick important information</Text>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <Icon
                            name={isFavourite ? "star" : "star-outlined"}
                            type="entypo"
                            size={25}
                            onPress={toggleFavourite}
                        />
                        <Text style={{ fontSize: 11, padding: 5 }}>
                            {isFavourite ? "Favourited!" : "Add to Favourites"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}