import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { IconUserCircle } from '@tabler/icons-react-native';
import Header from '../';


export default function HomePage() {
    const handlePress = () => {
        console.log("Button pressed");
    }

    return (
        <View style={styles.container}>
            <Text>This is a home page</Text>
            <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
                <IconUserCircle size={24} color="black"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6D7FA",
    },
    iconButton: {
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
    },
});