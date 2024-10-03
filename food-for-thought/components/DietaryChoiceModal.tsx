import { Button, Icon, Overlay, Avatar, Text, ListItem, CheckBox } from "@rneui/themed";
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";
import React, { useState } from "react";
import { capitaliseFirstLetter, formatTextValue } from "@/utils";

export type DietaryChoiceProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isVisible: boolean;
};

export function DietaryChoiceModal({
  setShowModal,
  isVisible,
}: DietaryChoiceProps) {
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [currentFilters, setCurrentFilters] = useState<{ type: string; value: string }[]>([]);

  const allergens = [
    "nuts",
    "eggs",
    "soy",
    "crustaceans",
    "fish",
    "milk",
    "peanuts",
    "sesame",
    "wheat",
    "lupin",
  ];
  const diets = [
    "vegetarian",
    "vegan",
    "halal",
    "gluten-free",
    "keto",
    "fodmap",
    "lactose-free",
    "low-sugar",
    "pescatarian",
  ];
  const cuisine = [
    "indian",
    "chinese",
    "thai",
    "italian",
    "mexican",
  ];

  const data = [
    {
      key: "Ingredient",
      value: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="circle" color="#E4EDFF" />
          <Text> Ingredient</Text>
        </View>
      ),
    },
    {
      key: "Cuisine",
      value: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="circle" color="#E7FFE7" />
          <Text> Cuisine</Text>
        </View>
      ),
    },
    {
      key: "Allergen",
      value: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="circle" color="#F3D9FF" />
          <Text> Allergen</Text>
        </View>
      ),
    },
    {
      key: "Diet",
      value: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="circle" color="#FFE7DC" />
          <Text> Diet</Text>
        </View>
      ),
    },
  ];

  const addFilter = (filter: string) => {
    if (filter) {
      setCurrentFilters((prev) => [
        ...prev,
        { type: selectedDietaryFilter, value: formatTextValue(filter) },
      ]);
      setNewFilter("");
    }
  };

  const onCheckFilter = (filterValue: string) => {
    const existingFilterIndex = currentFilters.findIndex(
      (filter) => filter.type === selectedDietaryFilter && filter.value === filterValue
    );

    if (existingFilterIndex !== -1) {
      // If the filter already exists, remove it
      setCurrentFilters((prev) => prev.filter((_, idx) => idx !== existingFilterIndex));
    } else {
      // If it does not exist, add it
      setCurrentFilters((prev) => [
        ...prev,
        { type: selectedDietaryFilter, value: filterValue },
      ]);
    }
  };

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
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
            fontSize: 18,
          }}
        >
          Add Dietary Filter
        </Text>
        <View style={{ marginTop: 20, width: 250 }}>
          <SelectList
            setSelected={(itemKey: string) => setSelectedDietaryFilter(itemKey)}
            data={data.map((item) => ({
              key: item.key,
              value: item.value,
              label: item.value,
            }))}
            save="key"
            boxStyles={{ borderRadius: 24, paddingTop: 14, paddingBottom: 9 }}
          />
        </View>
        {selectedDietaryFilter !== "" && (
          <View style={{ flexDirection: "column", marginTop: 0}}>
            <View style={styles.flexFormGroup}>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${selectedDietaryFilter}...`}
                value={newFilter}
                onChangeText={(value) => setNewFilter(value)}
              />
              {selectedDietaryFilter && (
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
              )}
            </View>
            <View>
              <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {getOptions()
                  .concat(
                    currentFilters
                      .filter(
                        (f) =>
                          f.type === selectedDietaryFilter &&
                          !getOptions().includes(f.value)
                      )
                      .map((f) => f.value)
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
                        title={option[0].toUpperCase()}
                        containerStyle={{ backgroundColor: "purple" }}
                      />
                      <ListItem.Content>
                        <ListItem.Title>{capitaliseFirstLetter(option)}</ListItem.Title>
                      </ListItem.Content>
                      <CheckBox
                        checked={
                          currentFilters.some(
                            (cur) =>
                              cur.type === selectedDietaryFilter &&
                              cur.value === formatTextValue(option)
                          )
                        }
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
              </ScrollView>
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
    overflow: "hidden"
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