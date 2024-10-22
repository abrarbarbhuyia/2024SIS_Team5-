import { Button, Icon, Overlay } from "@rneui/themed";
import { View, Image, Text, TextInput, Keyboard } from "react-native";
import * as React from "react";
import pic from "../assets/images/react-logo.png"; // Placeholder image
import { Restaurant } from "@/app/map";
import { styles } from "../styles/app-styles";
import axios from "axios";
import Constants from "expo-constants";
import { Note } from "@/components/RestaurantModal";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export type NoteModalProps = {
  setShowNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  restaurant: Restaurant;
  initialNote?: Note;
  username: string;
};

export function getRestaurantPhoto(restaurantPhotos?: string[], foodPhotos?: string[]) {
  return (foodPhotos && foodPhotos.length > 0) ? foodPhotos[0]
    : (restaurantPhotos && restaurantPhotos.length > 0) ? restaurantPhotos[0] : pic;
}

export function NoteModal({
  restaurant,
  initialNote,
  username,
  setShowNoteModal,
  ...rest
}: NoteModalProps) {
  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
  const [newNote, setNewNote] = React.useState<Note>(initialNote ??
  {
    date: new Date(Date.now()).toLocaleString().split(',')[0],
    content: '',
    restaurantId: restaurant.restaurantId,
    username: username,
    rating: 0
  });

  React.useEffect(() => {
    initialNote && setNewNote(initialNote)
  },
    [initialNote]);

  const handleCreateNote = async () => {
    try {
      const response = await axios.post(`http://${HOST_IP}:4000/note/createNote`, newNote);
      setNewNote(response.data);
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  const handleEditNote = async () => {
    try {
      if (newNote.noteId) {
        const requestBody = { date: newNote.date, content: newNote.content, rating: newNote.rating }
        await axios.put(`http://${HOST_IP}:4000/note/editNote/${newNote.noteId}`, requestBody);
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  return (
    <Overlay
      overlayStyle={styles.mapModal}
      isVisible={true}
      onBackdropPress={() => setShowNoteModal(false)} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ ...styles.noteFormHeader, ...styles.flexRowGroup }}>
          <View style={{ flex: 2 }}>
            <Text style={styles.subtitle}>Restaurant Note</Text>
            <Text style={styles.userText}>{newNote.noteId ? "Your thoughts on your recent visits" : "You have no existing notes, create one below"}</Text>
          </View>
          <View style={{ height: '100%', flex: 0.15, marginLeft: 'auto' }}>
            <Icon
              name='x'
              type='feather'
              iconStyle={styles.modalIcon}
              size={22}
              onPress={() => setShowNoteModal(false)} />
          </View>
        </View>
      </ TouchableWithoutFeedback >
      <View style={styles.verticalFlexFormGroup}>
        <View style={styles.flexFormGroup}>
          <View style={{ ...styles.noteImageContainer, marginRight: 0 }}>
            <Image source={{ uri: getRestaurantPhoto(restaurant.restaurantPhotos, restaurant.foodPhotos) }}
              style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={styles.noteDetailContainer}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 22 }}>{restaurant.name}</Text>
              <Text style={{ fontSize: 14, color: "gray" }}>{newNote.date}</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={index}
                    onPress={() => newNote && setNewNote({ ...newNote, rating: index + 1 })}
                    name="star"
                    type="font-awesome"
                    size={20}
                    iconStyle={
                      newNote.rating ? (index < newNote.rating ? styles.filledStar : styles.unfilledStar) : styles.unfilledStar
                    }
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
                    value={newNote.content}
                    onChangeText={(value) => setNewNote({ ...newNote, content: value })}
                    style={{ fontSize: 16, height: 50 }} // Adjust height as needed
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Button
            onPress={newNote.noteId ? handleEditNote : handleCreateNote}
            buttonStyle={{ ...styles.saveNoteButton }}
            titleStyle={{ ...styles.signUpButtonText, fontSize: 12 }}>
            {newNote.noteId ? "Save Changes" : "Create Note"}</Button>
        </View>
      </View>
    </Overlay>
  );
}
