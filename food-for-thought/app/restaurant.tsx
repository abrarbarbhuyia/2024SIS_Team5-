import Header from "@/components/Header";
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { Button, Card, Text, Tab, TabView } from '@rneui/themed';
import React from "react";
import { ButtonGroup } from "react-native-elements";

export default function Restaurant() {
    //stuff
    const [selectedIndex, setSelectedIndex] = React.useState(0);

        // Components to load based on selected index
    const renderContent = () => {
        switch (selectedIndex) {
            case 0:
                return <MenuComponent />;
            case 1:
                return <DescriptionComponent />;
            case 2:
                return <GalleryComponent />;
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.pageContainer} >
            <Header></Header>
            <View style={styles.detailsContainer}>
                <Text h4 style={{padding: 30,}}>Restaurant Title</Text>
                <Card containerStyle={styles.tabContainer}>
                <ButtonGroup
                    buttonStyle={{ padding: 10, backgroundColor: '#FBF8FF' }}
                    selectedButtonStyle={{ backgroundColor: '#E8DEF8' }}
                    buttons={[
                    <Text>Menu</Text>,
                    <Text>Description</Text>,
                    <Text>Gallery</Text>
                    ]}
                    selectedIndex={selectedIndex}
                    onPress={setSelectedIndex}
                    containerStyle={{height: 50, borderRadius: 16, alignItems: 'flex-start'}}
                />
                <Card.Divider/>
                {/* load in page component or sumn based on selected button? */}
                {renderContent()}
                </Card>
            </View>
        </ScrollView>
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

const GalleryComponent = () => (
    <View>
        <Text>Gallery Content</Text>
    </View>
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: "#E6D7FA",
    },
    detailsContainer: {
        alignItems: 'center',
        backgroundColor: '#F5EEFF',
        paddingTop: 15,
        width: width,
        height: height,
        paddingBottom: 135,
    },
    tabContainer: {
        flex: 1,
        backgroundColor: '#FBF8FF',
        width: width - 32,
        padding: 12,
        borderRadius: 24,
        marginTop: 5,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        marginBottom: 15,
    }
})