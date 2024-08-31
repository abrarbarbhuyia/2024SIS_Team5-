import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { IconUserCircle, IconSettings } from "@tabler/icons-react-native";

export default function Header() {
    const handlePress = () => {
        console.log("Button pressed");
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
                <IconUserCircle size={36} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
                <IconSettings size={36} color="black"/>
            </TouchableOpacity>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    iconButton: {
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
    },
    card: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 8,
        marginTop: 48,
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 2,
        shadowRadius: 4,
        margin: 16,
        width: width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
    },
});