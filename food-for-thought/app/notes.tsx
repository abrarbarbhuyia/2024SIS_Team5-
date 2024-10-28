import { View, Image, TouchableOpacity } from "react-native";
import { Icon, Text, Overlay, Button } from '@rneui/themed';
import React from "react";
import { styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';
import { NoteModal } from "@/components/NoteModal";
import Layout from "@/components/Layout";
import { Restaurant, Note } from "@/constants/interfaces";
import useLoadUser from '@/hooks/useLoadUser';

const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

export default function Notes() {
    const { username, loadUser } = useLoadUser();
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [noteToRemove, setNoteToRemove] = React.useState<Note>();
    const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
    const [showNoteModal, setShowNoteModal] = React.useState<boolean>(false);
    const [activeNote, setActiveNote] = React.useState<Note>();

    React.useEffect(() => {
        loadUser();
    }, [loadUser, username]);

    const renderStars = (rating: number) => {
        return (
            <View style={{ ...styles.starContainer }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                        key={index}
                        name='star'
                        type='font-awesome'
                        iconStyle={index < rating ? styles.filledStar : styles.unfilledStar}
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
                notesArray.forEach(async (n: Note) => {
                    const restaurant = restaurants.find((r: Restaurant) => n.restaurantId == r.restaurantId);
                    if (restaurant) {
                        n.restaurantName = restaurant.name
                        n.restaurantImageUrl = restaurant.foodPhotos?.[0] ?? restaurant.restaurantPhotos?.[0] ?? '';
                    }
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
    }, [restaurants, username, showNoteModal]); // when the restaurant variable is modified, the useEffect is called

    React.useEffect(() => {
        fetchRestaurants();
    }, [username]);
    return (
        <Layout>
            <View style={{ ...styles.pageContainer, justifyContent: 'flex-start' }} >
                <View style={{ ...styles.detailsContainer }}>
                    <Text style={styles.subtitle}>Notes</Text>
                    <Text style={styles.userText}>Your thoughts on your recent visits</Text>
                    {notes && notes.length > 0 ? <View style={{ ...styles.rectangle, shadowOpacity: 0.2, marginTop: 35, paddingVertical: 15, gap: 10 }}>
                        {notes.map((n, i) =>
                            <TouchableOpacity key={`note-${n.restaurantId}`} onPress={() => {
                                setShowNoteModal(true);
                                setActiveNote(n);
                            }} style={{ flexDirection: 'row', ...(notes.length - 1 !== i && {borderBottomWidth: 1, borderBottomColor: '#EEE'}), height: 90 }}>
                                <View style={{ flex: 1.1, flexDirection: 'column', alignItems: 'center' }}>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Image source={{ uri: n.restaurantImageUrl }} style={{ borderRadius: 16, width: 80, height: 80 }} />
                                    </ View>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Text style={styles.noteTitle}>{n.restaurantName}</Text>
                                    <Text style={styles.userText}>{n.date}</Text>
                                    <View style={{ paddingTop: 6 }}><Text>{renderStars(n.rating)}</Text></View>
                                    <Text numberOfLines={1} style={{ ...styles.userText, textAlign: 'left', marginTop: -10, fontSize: 12 }}>{n.content}</Text>
                                </View >
                                <View style={{ flex: 0.4, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 5 }}>
                                    <Icon
                                        name='x'
                                        type='feather'
                                        iconStyle={styles.modalIcon}
                                        size={20}
                                        onPress={() => setNoteToRemove(n)} />
                                </View>
                            </TouchableOpacity>)}
                        {noteToRemove && <Overlay
                            overlayStyle={styles.modal}
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
                        {showNoteModal && username && (<NoteModal
                            setShowNoteModal={setShowNoteModal}
                            restaurant={(restaurants.find(r => r.restaurantId === activeNote?.restaurantId) as Restaurant)}
                            initialNote={activeNote}
                            username={username}
                        />)}
                    </View>
                        : <View style={{ paddingTop: 20 }}><Text>Please add your notes from the restaurant finder page.</Text></View>
                    }
                </View>
            </View>
        </Layout>
    )
}
