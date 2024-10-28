import { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, Icon, Card } from "@rneui/themed";
import Constants from "expo-constants";
import axios from "axios";
import { styles } from "@/styles/app-styles";
import MenuItemBadge from "./MenuItemBadge";
import { Ingredient, Meal as MealType, MealIngredient } from "@/constants/interfaces";

export default function Meal({ meal, state }: { meal: MealType, state: any }) {
  const [isDropDownSelected, setIsDropDownSelected] = useState<boolean>(false);
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const item = meal || {};
  const mealId = item.mealId;

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  useEffect(() => {
    if (mealId) {
      fetchMealIngredients(mealId);
    }
  }, [mealId]);

  //fetch a meal Ingredient associated with a meal
  const fetchMealIngredients = async (mealId: string) => {
    try {
      const response = await axios.get(
        `http://${HOST_IP}:4000/mealIngredient/getMealIngredient/${mealId}`
      );
      const mealIngredientData = response.data;
      setMealIngredients(mealIngredientData);

      // Fetch each ingredient based on the ingredientId from mealIngredients
      const ingredientPromises = mealIngredientData.map(
        async (mealIngredient: MealIngredient) => {
          return fetchIngredient(mealIngredient.ingredientId); // Fetch ingredient details
        }
      );

      // Resolve all promises and update ingredients state
      const ingredientsData = await Promise.all(ingredientPromises);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error("Error fetching meal ingredient:", error);
    }
  };

  // Fetch individual ingredient by ingredientId
  const fetchIngredient = async (ingredientId: string) => {
    try {
      const response = await axios.get(
        `http://${HOST_IP}:4000/ingredient/getIngredient/${ingredientId}`
      );
      const ingredientData = response.data;

      // Check if ingredientData is an array and has at least one element
      if (Array.isArray(ingredientData) && ingredientData.length > 0) {
        return ingredientData[0].name; // Return the name of the first ingredient
      } else {
        return "Unknown Ingredient";
      }
    } catch (error) {
      console.error("Error fetching ingredient:", error);
      return "Unknown Ingredient"; // Fallback in case of error
    }
  };

  const toggleDropDown = () => {
    setIsDropDownSelected((prev) => !prev);
  };

  return (
    <View>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{item.name}</Text>
        {/* <Text>$16.90</Text> */}
      </View>
      <View style={styles.mealFilterList}>
        <Icon name="sliders" type="font-awesome" size={20} color={"#A394B8"} />
        <View style={{paddingLeft: 8, paddingTop: 2}}>
            <MenuItemBadge matches={state ? 15 : 0} smallText/>  
        </View>
      </View>
      <TouchableOpacity
        style={styles.ingredientsDropDownInteractable}
        onPress={toggleDropDown}
      >
        <Icon
          name={
            isDropDownSelected ? "keyboard-arrow-up" : "keyboard-arrow-right"
          }
          type="material-icons"
          size={30}
          color={"#A394B8"}
        />
        <Text
          style={
            isDropDownSelected
              ? styles.ingredientsText
              : styles.viewIngredientsText
          }
        >
          {isDropDownSelected ? ingredients.join(", ") : "View ingredients"}
        </Text>
      </TouchableOpacity>
      <View style={{ justifyContent: "center" }}>
        <Card.Divider
          inset={false}
          insetType="left"
          width={1.5}
          style={{ width: "85%", marginLeft: 30 }}
        />
      </View>
    </View>
  );
}
