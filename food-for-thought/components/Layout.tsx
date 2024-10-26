import { View } from "react-native";
import { ReactNode } from "react";
import { styles } from '../styles/app-styles'; 
import Header from "./Header";

interface layoutProp {
    children: ReactNode;
}

const Layout = ({children}: layoutProp) =>{
    return (
        <View style={styles.container}>
            <Header/>
            {children}
        </View>
    );
}

export default Layout;