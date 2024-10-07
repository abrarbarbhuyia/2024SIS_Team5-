import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
} from "react-native";
import { Button, Card, Text } from "@rneui/themed";
import axios from "axios";
import { styles } from "../styles/app-styles";
import Header from "@/components/Header";
import { DietaryChoiceModal } from "@/components/DietaryChoiceModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import Constants from "expo-constants";

// Define the type for your table data
interface TableData {
  name: string;
  type: string;
}

// Function to get color based on type
const getTypeColor = (type: string) => {
  switch (type) {
    case "Allergen":
      return "#F3D9FF";
    case "Ingredient":
      return "#E4EDFF";
    case "Diet":
      return "#FFE7DC";
    case "Cuisine":
      return "#FFF2D9";
    default:
      return "#CCCCCC";
  }
};

const renderRow = ({ item }: { item: TableData }) => (
  // Main box
  <View
    style={{
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#CCCCCC",
      alignItems: "center",
      minHeight: 65,
    }}
  >
    {/* Column 1 - Name */}
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ textAlign: "center" }}>{item.name}</Text>
    </View>

    {/* Divider */}
    <View
      style={{
        width: 1,
        backgroundColor: "#CCCCCC",
        height: "100%",
        marginHorizontal: 10,
      }}
    />

    {/* Column 2 - Type and Delete Button */}
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Type Tag */}
      <View
        style={{
          backgroundColor: getTypeColor(item.type),
          borderRadius: 24,
          paddingVertical: 6,
          paddingHorizontal: 12,
          minWidth: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>{item.type}</Text>
      </View>

      {/* Delete Button */}
      <Button
        type="clear"
        titleStyle={{ fontSize: 18, color: "grey", fontWeight: "bold" }}
        buttonStyle={{ backgroundColor: "transparent" }}
        containerStyle={{ marginLeft: 10 }}
      >
        X
      </Button>
    </View>
  </View>
);

const Preferences: React.FC = () => {
  const [dietaryChoiceModal, setDietaryChoiceModal] = useState<boolean | undefined>(false);
  const [username, setUsername] = useState<string>("");
  const [tableData, setTableData] = useState<TableData[]>([]);

  // Get current logged in user ID
  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken?.username) {
          setUsername(decodedToken.username);
        } else {
          console.error("Decoded token does not have username");
        }
      } else {
        console.error("No token found");
      }
    } catch (error) {
      console.error("Invalid token or unable to decode", error);
    }
  }, []);

  // Get dietary preference table data (user.preferences)
  const loadPreferences = useCallback(async (username: string) => {
    if (!username) {
      console.log("username not fetched, skipping preferences load");
      return;
    }
    const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
    console.log("HOST IP", HOST_IP);
    try {
      const response = await axios.get(
        `http://${HOST_IP}:4000/user/getUserPreference/${username}`
      );
      console.log("Preferences data found", response.data);
      setTableData(response.data);
    } catch (error: any) {
      console.error("Error searching user preferences", error);
    }
  }, []);

  useEffect(() => {
    // Load user when the component mounts
    loadUser();
  }, [loadUser]); // Only run once when the component mounts

  useEffect(() => {
    // Load preferences when the username is available
    if (username) {
      loadPreferences(username);
    }
  }, [username, loadPreferences]); // Run whenever 'username' changes

  return (
    <View style={styles.container}>
      <Header homepage={false} />
      {/* Component for Dietary Preferences Heading */}
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Text h3 style={{ color: "#1D1B20", fontWeight: "600" }}>
          Dietary Preferences
        </Text>

        {/* Button for adding new Preferences */}
        <Button
          buttonStyle={styles.buttonDietPref}
          titleStyle={styles.buttonTitle}
          onPress={() => setDietaryChoiceModal(true)}
          title="Add New Dietary Preferences"
        />
      </View>
      {/* Table of Dietary Preferences */}
      <Card containerStyle={styles.dietaryPreferencesCard}>
        <View style={{ alignSelf: "stretch", marginBottom: 16 }}>
          {/* Table Header */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#f0f0f0",
              padding: 10,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Name
            </Text>
            <View
              style={{
                width: 1,
                backgroundColor: "#CCCCCC",
                height: "100%",
                marginHorizontal: 10,
              }}
            />
            <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
              Type
            </Text>
          </View>
        </View>
        {/* Table Body */}
        <FlatList
          data={tableData}
          renderItem={renderRow}
          keyExtractor={(item) => item.name}
          style={{ alignSelf: "stretch", maxHeight: 525 }}
        />
      </Card>
      {dietaryChoiceModal && (
        <DietaryChoiceModal setShowModal={setDietaryChoiceModal} isVisible={true} />
      )}
    </View>
  );
};

export default Preferences;