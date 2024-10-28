import { View, Image, FlatList, Modal, TouchableOpacity } from "react-native";
import { Text } from '@rneui/themed';
import React from "react";
import { currentFont, styles } from "@/styles/app-styles";
import { Restaurant } from "@/constants/interfaces";

export default function RestaurantGallery({ restaurant }: { restaurant: Restaurant }) {

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [selectedImage, setSelectedImage] = React.useState<string>("");

    //open and close modal
    const openModal = (image: string) => {
        setSelectedImage(image);
        setModalVisible(true);
    }

    const closeModal = () => {
        setSelectedImage("");
        setModalVisible(false);
    }

    //carousel view + styling
    const renderItem = ({ item } : { item: string }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
        <View style={styles.galleryImageContainer}>
            <Image source={{uri: item}} style={styles.image} />
        </View>
    </TouchableOpacity>
    )

    return (
        <View style={{padding: 10,}}>
            <Text style={{...currentFont, fontWeight: 500, fontSize: 22 }}>Restaurant Photos</Text>
            <FlatList
            data={restaurant?.restaurantPhotos || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            />
            <Text style={{paddingTop: 25, fontWeight: 500, ...currentFont, fontSize: 22 }}>Food Photos</Text>
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
                            <Image source={{uri: selectedImage}} style={styles.fullImage}/>
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}