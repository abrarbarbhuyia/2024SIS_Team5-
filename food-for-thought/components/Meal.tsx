import { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text, Icon, Card } from '@rneui/themed';

export default function Meal() {

    const [isDropDownSelected, setIsDropDownSelected] = useState(false);

    const toggleDropDown = () => {
        setIsDropDownSelected((prev) => !prev);
    }

    return (
        <View>
            <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>Crispy Bean Curd (TOFU)</Text>
                <Text>$16.90</Text>
            </View>
            <View style={styles.mealFilterList}>
                <Icon name='sliders' type='font-awesome' size={20} color={'#A394B8'}/>
            </View>
            <TouchableOpacity style={styles.ingredientsDropDownInteractable} onPress={toggleDropDown}>
                <Icon 
                    name={isDropDownSelected ? 'keyboard-arrow-up' : 'keyboard-arrow-right'}
                    type='material-icons' 
                    size={30}
                    color={'#A394B8'}/>
                <Text
                    style={isDropDownSelected ? styles.ingredientsText : styles.viewIngredientsText}
                >
                    {isDropDownSelected ? 'Tofu, soy sauce, bean curd, sesame seeds, onion, garlic' : 'View ingredients' }
                </Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'center'}}>
                <Card.Divider inset={false} insetType="left" width={1.5} style={{width: '85%', marginLeft: 30,}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        paddingTop: 5,
    },
    mealTitle: {
        fontSize: 18,
    },
    mealFilterList: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingTop: 8,
    },
    ingredientsDropDownInteractable: {
        flexDirection: 'row',
        paddingLeft: 35,
        padding: 5,
        alignItems: 'center',
        paddingBottom: 10,
    }, 
    ingredientsText: {

    },
    viewIngredientsText: {
        color: '#A394B8',
    }
})