import Header from "@/components/Header";
import { View, Image, StyleSheet, Dimensions, FlatList, Modal, TouchableOpacity } from "react-native";
import { Button, Card, Text, Tab, TabView } from '@rneui/themed';
import React from "react";
import { ButtonGroup } from "react-native-elements";
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

export default function Restaurant() {
    //stuff
    const [selectedIndex, setSelectedIndex] = React.useState(0);
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


    // Components to load based on selected index
    const renderContent = () => {
        switch (selectedIndex) {
            case 0:
                return <MenuComponent />;
            case 1:
                return <DescriptionComponent />;
            case 2:
                return <GalleryComponent renderItem={renderItem}/>;
            default:
                return null;
        }
    };

      //carousel view + styling
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item.image)}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.pageContainer} >
            <Header />
            <View style={styles.detailsContainer}>
                <Text h4 style={{padding: 20,}}>Restaurant Title</Text>
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
                    containerStyle={{flexGrow: 1, borderRadius: 16, borderWidth: 0, height: 50}}
                />
                <Card.Divider/>
                {/* load in page component or sumn based on selected button? */}
                {renderContent()}
                </Card>
            </View>
            
            {/* Modal for displaying full size image on selection */}
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

// Example components
const MenuComponent = () => (
    <View>
        <Text>Menu Content</Text>
    </View>
);

const DescriptionComponent = () => (
    <View>
        <Text>Description Content</Text>
    </View>
);

const GalleryComponent = ({renderItem}) => (
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
        <Text h4>Other</Text>
        <FlatList
          data={carouselData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />
    </View>
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "#E6D7FA",
        flex: 1,
    },
    detailsContainer: {
        alignItems: 'center',
        backgroundColor: '#F5EEFF',
        paddingTop: 15,
        width: width,
        height: height,
        paddingBottom: 125,
        marginTop: 15,
    },
    tabContainer: {
        flex: 1,
        backgroundColor: '#FBF8FF',
        width: width - 32,
        padding: 2,
        borderRadius: 24,
        marginTop: 5,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        marginBottom: 15,
    },
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