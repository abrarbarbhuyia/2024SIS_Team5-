import { Text, View, StyleSheet } from "react-native";
import Header from '../../components/Header';


export default function HomePage() {

    return (
        <View style={styles.container}>
            {/* <Text>This is a home page</Text> */}
            <Header/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6D7FA",
    },
});