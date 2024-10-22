import { Button, Icon, Overlay, Divider, Badge } from "@rneui/themed";
import { View, Image, Text, TextInput } from "react-native";
import * as React from "react";
import pic from "../assets/images/react-logo.png"; // Placeholder image
import { Restaurant } from "@/app/map";
import { styles } from "../styles/app-styles";
import { router } from "expo-router";
import MenuItemBadge from "./MenuItemBadge";
import { getDistance } from "geolib";
import axios from "axios";
import Constants from "expo-constants";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";
import { getRestaurantPhoto, Note } from "@/components/RestaurantModal";

export type NoteModalProps = {
  setShowNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  restaurant: Restaurant;
  note?: Note;
  username: string;
};

export function NoteModal({
  restaurant,
  note,
  username,
  setShowNoteModal,
  ...rest
}: NoteModalProps) {
  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  const handleDeleteNote = () => {
    console.log("Delete note action triggered");
  };

  const handleEditNote = () => {
    console.log("Edit note action triggered");
  };

  return (
    <Overlay
      overlayStyle={styles.modal}
      isVisible={true}
      onBackdropPress={() => setShowNoteModal(false)}
    >
      <View style={styles.noteFormHeader}>
        <Text style={styles.subtitle}>Restaurant Note</Text>
        <Text style={styles.userText}>{note ? "Your thoughts on your recent visits" : "You have no existing notes, feel free to create "}</Text>
      </View>
      <View style={styles.verticalFlexFormGroup}>
        <View style={styles.flexFormGroup}>
          <View style={{ ...styles.noteImageContainer, marginRight: 0}}>
          <Image source={{ uri: getRestaurantPhoto(restaurant.restaurantPhotos, restaurant.foodPhotos)}}
              style={{width: '100%', height: '100%'}}/>
          </View>
          <View style={styles.noteDetailContainer}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 22 }}>{restaurant.name}</Text>
              <Text style={{ fontSize: 14, color: "gray" }}>2024-10-21</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={index}
                    name="star"
                    type="font-awesome"
                    size={20}
                    iconStyle={{ color: index < 3 ? "gold" : "gray" }}
                  />
                ))}
              </View>
              <View style={{ marginBottom: 8 }}>
                <View
                  style={{
                    borderColor: "#ccc",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    placeholder="Write your note here..."
                    multiline
                    style={{ fontSize: 16, height: 50 }} // Adjust height as needed
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View>
            <Button buttonStyle={{...styles.saveNoteButton}} titleStyle={{...styles.signUpButtonText, fontSize: 12}}>Save Changes</Button>
        </View>
      </View>
    </Overlay>
  );
}
