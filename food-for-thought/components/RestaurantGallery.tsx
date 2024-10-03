import { View, Image, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { Text } from '@rneui/themed';
import React from "react";
import pic from '../assets/images/react-logo.png';
import { styles } from "@/styles/app-styles";

//mock images for gallery tab
const carouselData = [
    { id: '1', image: pic },
    { id: '2', image: pic },
    { id: '3', image: pic },
    { id: '4', image: pic },
    { id: '5', image: pic },
    { id: '6', image: pic },
    { id: '7', image: pic },
];

export default function RestaurantGallery({restaurant}) {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);

    //open and close modal
    const openModal = (image : any) => {
        setSelectedImage(image);
        setModalVisible(true);
    }

    const closeModal = () => {
        setSelectedImage(null);
        setModalVisible(false);
    }

    //carousel view + styling
    const renderItem = ({ item } : any) => (
    <TouchableOpacity onPress={() => openModal({uri: item})}>
        <View style={styles.galleryImageContainer}>
            <Image source={{uri: item}} style={styles.image} />
        </View>
    </TouchableOpacity>
    )

    return (
        <View style={{padding: 10,}}>
            <Text h4>Restaurant Photos</Text>
            <FlatList
            data={restaurant?.restaurantPhotos || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            />
            <Text h4 style={{paddingTop: 25}}>Food Photos</Text>
            <FlatList
            data={restaurant?.foodPhotos || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            />

            {/* modal for selected image taking full screen */}
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
                        {selectedImage && (
                            <Image source={selectedImage} style={styles.fullImage}/>
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}