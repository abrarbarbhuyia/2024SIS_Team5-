import Header from "@/components/Header";
import { View, Image } from "react-native";
import { Icon, Text, Overlay, Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React from "react";
import { styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';
export type Note = {
    noteId: string,
    date: string,
    content: string,
    restaurantId: string,
    restaurantName: string,
    username: string,
    rating: number,
    restaurantImageUrl: string
}

const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

export default function Notes() {
    const [username, setUsername] = React.useState<string>();
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [noteToRemove, setNoteToRemove] = React.useState<Note>();
    const [restaurants, setRestaurants] = React.useState<any>([]);

    const loadUser = React.useCallback(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUsername(decodedToken.username);
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, []);

    React.useEffect(() => {
        loadUser();
    }, [loadUser]);

    const renderStars = (rating: number) => {
        const stars = Math.round(rating / 2); // get rating between 0 and 5
        return (
            <View style={{ ...styles.starContainer }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                        key={index}
                        name='star'
                        type='font-awesome'
                        iconStyle={index < stars ? styles.filledStar : styles.unfilledStar}
                        size={15}
                    />
                ))}
            </View>
        );
    };

    const fetchRestaurants = async () => {
        const restaurantUrl = `http://${HOST_IP}:4000/restaurant/getRestaurants/`;
        await axios.get(restaurantUrl)
            .then(response => setRestaurants(response.data))
            .catch(error => {
                console.error("Error fetching all restaurants", error)
            });

    }

    const handleDeleteNote = async (note: Note) => {
        const noteUrl = `http://${HOST_IP}:4000/note/deleteNote/${note.noteId}`;
        await axios.delete(noteUrl)
            .then(() => setNotes(notes.filter(n => n.noteId !== note.noteId)))
            .catch(error => console.error("Error deleting the note ", error));
    };

    const fetchNotes = async () => {
        const url = `http://${HOST_IP}:4000/note/getNotes/${username}`;
        await axios.get(url)
            .then(response => {
                const notesArray = response.data;
                notesArray.forEach(async (n: any) => {
                    const restaurant = restaurants.find((r: any) => n.restaurantId == r.restaurantId)
                    n.restaurantName = restaurant.name
                    n.restaurantImageUrl = restaurant.foodPhotos[0];
                })
                setNotes(notesArray);
            })
            .catch(error => console.error("Error fetching all restaurants", error)
            );
    }
    React.useEffect(() => {
        if (username && restaurants.length > 0) {
            fetchNotes();
        }
    }, [restaurants, username]); // when the restaurant variable is modified, the useEffect is called

    React.useEffect(() => {
        fetchRestaurants();
    }, [username]);
    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }} >
            <Header />
            <View style={{ paddingTop: 70 }}>
                <Text style={styles.subtitle}>Notes</Text>
                <Text style={styles.userText}>Your thoughts on your recent visits</Text>
                {notes && notes.length > 0 ? <View style={{ ...styles.rectangle, shadowOpacity: 0.2, marginTop: 35 }}>
                    {notes.map(n =>
                        <View key={`note-${n.restaurantId}`} style={{ flexDirection: 'row', height: 90 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Image source={{ uri: n.restaurantImageUrl }} style={{ borderRadius: 16, width: 80, height: 80 }} />
                                </ View>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start', gap: 2, paddingLeft: 5 }}>
                                <Text style={styles.noteTitle}>{n.restaurantName}</Text>
                                <Text style={styles.userText}>{n.date}</Text>
                                <View style={{ paddingTop: 6 }}><Text>{renderStars(n.rating)}</Text></View>
                                <Text numberOfLines={1} style={{ ...styles.userText, textAlign: 'left', marginTop: -10 }}>{n.content}</Text>
                            </View >
                            <View style={{ flex: 0.4, flexDirection: 'column', alignItems: 'flex-start', gap: 2, paddingLeft: 5 }}>
                                <Icon
                                    name='x'
                                    type='feather'
                                    iconStyle={styles.modalIcon}
                                    size={20}
                                    onPress={() => setNoteToRemove(n)} />
                            </View>
                        </View>)}
                    {noteToRemove && <Overlay
                        overlayStyle={{ ...styles.modal }}
                        isVisible={noteToRemove !== undefined}
                        onBackdropPress={() => setNoteToRemove(undefined)}>
                        <View style={{ padding: 20, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ ...styles.formHeaderText, paddingBottom: 20 }}>Confirm Removal</Text>
                            <Text style={styles.userText}>Are you sure want to remove your note on the {noteToRemove.restaurantName}?</Text>
                            <Button buttonStyle={{ ...styles.button, paddingHorizontal: 25, marginTop: 20 }}
                                titleStyle={{ ...styles.buttonTitle, fontSize: 12 }}
                                onPress={() => {
                                    handleDeleteNote(noteToRemove);
                                    setNoteToRemove(undefined);
                                }}
                                title={('remove note').toUpperCase()} />
                        </View>
                    </Overlay>}
                </View>
                    : <View style={{ paddingTop: 20 }}><Text>Please add your notes from the restaurant finder page.</Text></View>
                }
            </View>
        </View>
    )
}