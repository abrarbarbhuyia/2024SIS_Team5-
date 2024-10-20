import {
  Button,
  Icon,
  Overlay,
  Avatar,
  Text,
  ListItem,
  CheckBox,
} from "@rneui/themed";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";

export type DietaryChoiceProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isVisible: boolean;
  username: string;
  refreshPreferences: () => void;
};

export function DietaryChoiceModal({
  setShowModal,
  isVisible,
  username,
  refreshPreferences,
}: DietaryChoiceProps) {
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [currentFilters, setCurrentFilters] = useState<{ name: string; type: string }[]>([]);

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  useEffect(() => {
    if (username) {
      axios
        .get(`http://${HOST_IP}:4000/user/getUserPreference/${username}`)
        .then((response) => {
          setCurrentFilters(response.data);
        })
        .catch((error) => {
          console.error("Error loading preferences", error);
        });
    }
  }, [username]);

  const allergens = [
    "Nuts",
    "Eggs",
    "Soy",
    "Crustaceans",
    "Fish",
    "Milk",
    "Peanuts",
    "Sesame",
    "Wheat",
    "Lupin",
  ];
  const diets = [
    "Vegetarian",
    "Vegan",
    "Halal",
    "Gluten-Free",
    "Keto",
    "Fodmap",
    "Lactose-Free",
    "Low-Sugar",
    "Pescatarian",
  ];
  const cuisine = ["Indian", "Chinese", "Thai", "Italian", "Mexican"];

  const data = [
    { key: "Ingredient", value: "Ingredient" },
    { key: "Cuisine", value: "Cuisine" },
    { key: "Allergen", value: "Allergen" },
    { key: "Diet", value: "Diet" },
  ];

  // Add a new filter (via text input)
  const addFilter = async (filter: string) => {
    if (filter) {
      try {
        const formattedFilter = {
          type: selectedDietaryFilter,
          name: filter.trim(), // Preserve original casing
        };
        await axios.put(
          `http://${HOST_IP}:4000/user/createUserPreference/${username}`,
          { preference: [formattedFilter] }
        );
        setCurrentFilters((prev) => [...prev, formattedFilter]);
        setNewFilter("");
        refreshPreferences();
      } catch (error) {
        console.error("Error adding preference", error);
      }
    }
  };

  // Handle checking/unchecking a filter from dropdown options
  const onCheckFilter = async (filterName: string) => {
    const formattedFilter = { type: selectedDietaryFilter, name: filterName };
    const existingFilter = currentFilters.find(
      (filter) =>
        filter.type === selectedDietaryFilter && filter.name === filterName
    );

    if (existingFilter) {
      try {
        await axios.delete(
          `http://${HOST_IP}:4000/user/deleteUserPreference/${username}`,
          { data: { preferenceName: filterName } }
        );
        setCurrentFilters(
          (prev) => prev.filter((filter) => filter.name !== filterName)
        );
        refreshPreferences();
      } catch (error) {
        console.error("Error deleting preference", error);
      }
    } else {
      try {
        await axios.put(
          `http://${HOST_IP}:4000/user/createUserPreference/${username}`,
          { preference: [formattedFilter] }
        );
        setCurrentFilters((prev) => [...prev, formattedFilter]);
        refreshPreferences();
      } catch (error) {
        console.error("Error adding preference", error);
      }
    }
  };

  // Get available options based on selected filter type
  const getOptions = () => {
    switch (selectedDietaryFilter) {
      case "Allergen":
        return allergens;
      case "Diet":
        return diets;
      case "Cuisine":
        return cuisine;
      default:
        return [];
    }
  };

  return (
    <Overlay
      overlayStyle={styles.modal}
      isVisible={isVisible}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.modalTitle}>Add Dietary Filter</Text>
        <View style={styles.dropdownContainer}>
          <SelectList
            setSelected={(itemKey: string) => setSelectedDietaryFilter(itemKey)}
            data={data}
            save="key"
            boxStyles={styles.selectBox}
          />
        </View>
        {selectedDietaryFilter !== "" && (
          <View style={{ flexDirection: "column", marginTop: 0 }}>
            <View style={styles.flexFormGroup}>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${selectedDietaryFilter}...`}
                value={newFilter}
                onChangeText={(value) => setNewFilter(value)}
              />
              <Button
                buttonStyle={styles.button}
                onPress={() => newFilter && addFilter(newFilter)}
              >
                <Icon
                  name="plus"
                  type="feather"
                  iconStyle={styles.icon}
                  size={22}
                />
              </Button>
            </View>
            <View>
              {currentFilters && <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
              >
                {getOptions()
                  .concat(
                    currentFilters
                      .filter(
                        (f) =>
                          f.type === selectedDietaryFilter &&
                          !getOptions().includes(f.name)
                      )
                      .map((f) => f.name)
                  )
                  .map((option) => (
                    <ListItem
                      bottomDivider
                      containerStyle={styles.listItem}
                      key={`${option}-${selectedDietaryFilter}`}
                    >
                      <Avatar
                        size={32}
                        rounded
                        title={option?.[0]?.toUpperCase() || "?"}
                        containerStyle={{ backgroundColor: "purple" }}
                      />
                      <ListItem.Content>
                        <ListItem.Title>{option || "?"}</ListItem.Title>
                      </ListItem.Content>
                      <CheckBox
                        checked={currentFilters.some(
                          (cur) =>
                            cur.type === selectedDietaryFilter &&
                            cur.name === option
                        )}
                        onPress={() => onCheckFilter(option)}
                        checkedColor="#5A428F"
                        uncheckedColor="#BCBCBC"
                        checkedIcon={
                          <Icon
                            name="check-box"
                            type="material"
                            color="#5A428F"
                            size={25}
                            iconStyle={styles.checkboxIcon}
                          />
                        }
                        size={25}
                        containerStyle={styles.checkBoxContainer}
                      />
                    </ListItem>
                  ))}
              </ScrollView>}
            </View>
          </View>
        )}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    backgroundColor: "#FBF8FF",
    borderRadius: 20,
    width: "80%",
    padding: 15,
    height: 500,
    overflow: "hidden",
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
  },
  dropdownContainer: {
    marginTop: 20,
    width: 250,
  },
  selectBox: {
    borderRadius: 24,
    paddingTop: 14,
    paddingBottom: 9,
  },
  flexFormGroup: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingBottom: 0,
    flexDirection: "row",
    gap: 15,
  },
  input: {
    width: "70%",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontFamily: "Roboto",
    fontSize: 15,
    color: "#808080",
    height: 38,
  },
  icon: {
    color: "white",
  },
  button: {
    backgroundColor: "#5A428F",
    height: 38,
  },
  listItem: {
    width: "100%",
    backgroundColor: "inherit",
    paddingVertical: 10,
  },
  scrollView: {
    maxHeight: 270,
    width: "100%",
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxIcon: {
    marginRight: 3,
  },
});