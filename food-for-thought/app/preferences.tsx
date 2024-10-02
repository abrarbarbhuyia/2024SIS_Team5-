import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { Button, Card, Text, Icon } from "@rneui/themed";
import axios from "axios";
import { styles } from "../styles/app-styles";
import Header from "@/components/Header";
import { DietaryChoiceModal } from "@/components/DietaryChoiceModal";

// Define the type for your table data
interface TableData {
  id: string;
  name: string;
  age: number;
}

const tableData = [
  { id: "1", name: "John", age: 28 },
  { id: "2", name: "Sarah", age: 24 },
  { id: "3", name: "Michael", age: 30 },
  { id: "4", name: "John", age: 28 },
  { id: "5", name: "Sarah", age: 24 },
  { id: "6", name: "Michael", age: 30 },
  { id: "7", name: "John", age: 28 },
  { id: "8", name: "Sarah", age: 24 },
  { id: "9", name: "Michael", age: 30 },
  { id: "10", name: "John", age: 28 },
  { id: "11", name: "Sarah", age: 24 },
  { id: "12", name: "Michael", age: 30 },
  { id: "13", name: "John", age: 28 },
  { id: "14", name: "Sarah", age: 24 },
  { id: "15", name: "Michael", age: 30 },
];

const renderRow = ({ item }: { item: TableData }) => (
  // Main box
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#CCCCCC",
      alignItems: "center",
      minHeight: 65,
    }}
  >
    {/* Column 1 */}
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          flex: 1,
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
        }}
      >
        {item.id}
      </Text>
    </View>

    {/* Column 2 */}
    <View
      style={{
        width: 1,
        backgroundColor: "#CCCCCC",
        height: "100%",
        marginHorizontal: 5,
      }}
    />

    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ flex: 1, textAlign: "center" }}>{item.age}</Text>
      <Button
        type="clear"
        titleStyle={{ fontSize: 18, color: "grey", fontWeight: "bold" }}
        buttonStyle={{ backgroundColor: "transparent", }}
        containerStyle={{flex: 1, alignItems: 'center'}}
      >
        X
      </Button>
    </View>
  </View>
);



const Preferences: React.FC = () => {
  // const [modalVisible, setModalVisible] = useState(false);
  const [dietaryChoiceModal, setDietaryChoiceModal] = useState<boolean | undefined>(false);
  // Render individual row
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
                borderRightWidth: 10,
                borderRightColor: "#CCCCCC",
                paddingRight: 10,
              }}
            >
              Name
            </Text>
            <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
              Type
            </Text>
          </View>
        </View>
        {/* Table Body */}
        <FlatList
          data={tableData}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
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
