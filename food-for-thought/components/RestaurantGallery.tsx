import { View, Image, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { Text } from '@rneui/themed';
import React from "react";
import pic from '../assets/images/react-logo.png';

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

export default function RestaurantGallery() {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);

    //open and close modal
    const openModal = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    }

    const closeModal = () => {
        setSelectedImage(null);
        setModalVisible(false);
    }

    //carousel view + styling
    const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item.image)}>
        <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
        </View>
    </TouchableOpacity>
    )

    return (
        <View style={{padding: 10,}}>
            <Text h4>Menu</Text>
            <FlatList
            data={carouselData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            />
            <Text h4 style={{paddingTop: 25}}>Other</Text>
            <FlatList
            data={carouselData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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

const styles = StyleSheet.create({
    carousel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    imageContainer: {
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        width: 180,
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
})