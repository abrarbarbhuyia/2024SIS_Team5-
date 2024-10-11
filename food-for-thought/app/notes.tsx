import Header from "@/components/Header";
import { View, Image } from "react-native";
import { Card, Icon, Text } from '@rneui/themed';
import React from "react";
import { styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';

export type Notes = {
    noteId: string,
    date: string,
    content: string,
    restaurantId: string,
    restaurantName: string,
    userId: string,
    rating: number,
    restaurantImageUrl: string
}

const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

export default function Notes() {
    const [notes, setNotes] = React.useState<Notes[]>([]);
    const [restaurants, setRestaurants] = React.useState<any>([]);
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

    const fetchNotes = async () => {
        const userId = '123456'
        const url = `http://${HOST_IP}:4000/note/getNotes/${userId}`;
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
        fetchNotes();
    }, [restaurants]); // when the restaurant variable is modified, the useEffect is called

    React.useEffect(() => {
        fetchRestaurants();
    }, []);
    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }} >
            <Header />
            <View style={{ paddingTop: 70 }}>
                <Text style={styles.subtitle}>Notes</Text>
                <Text style={styles.userText}>Your thoughts on your recent visits</Text>
                {notes.length > 0 ? <View style={{ ...styles.rectangle, shadowOpacity: 0.2, marginTop: 35 }}>
                    {notes.map(n =>
                        <View style={{ flexDirection: 'row', height: 90 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Image source={{ uri: n.restaurantImageUrl }} style={{ borderRadius: 16, width: 80, height: 80 }} />
                                </ View>
                            </View>
                            <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start', gap: 2, paddingLeft: 5 }}>
                                <Text style={styles.noteTitle}>{n.restaurantName}</Text>
                                <Text style={styles.userText}>{n.date}</Text>
                                <View style={{ paddingTop: 6 }}><Text>{renderStars(n.rating)}</Text></View>
                                <Text style={{ ...styles.userText, textAlign: 'left', marginTop: -10 }}>{n.content}</Text>
                            </View>
                        </View>)}
                </View>
                : <View style={{ paddingTop: 20 }}><Text>Please add your notes from the restaurant finder page.</Text></View>
                }
            </View>
        </View>
    )
}