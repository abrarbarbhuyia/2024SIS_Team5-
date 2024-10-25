import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/app-styles';
import axios from 'axios';
import Constants from 'expo-constants';
import Layout from '@/components/Layout';
import useLoadUser from '@/hooks/useLoadUser';

const UserProfile = () => {
  const { username, isGuest, loadUser } = useLoadUser();
  const [userNotes, setUserNotes] = useState(0);
  const [userFavourites, setUserFavourites] = useState(0);
  const [userPreferences, setUserPreferences] = useState(0);

  useEffect(() => {
    loadUser();
    handleUserDetails();
  }, [loadUser]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.push('/');
    loadUser();
  };

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  const handleUserDetails = useCallback(async () => {
    try {
      if (!isGuest) {
        const response = await axios.get(`http://${HOST_IP}:4000/user/getUser/${username}`);
        setUserFavourites(response.data?.favourites?.length ?? 0);
        // To do: update user notes count
        // setUserNotes(response.data?.notes?.length ?? 0);
        setUserPreferences(response.data?.preferences?.length ?? 0);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [userNotes, userFavourites, userPreferences]);

  return (
    <Layout>
      <Card containerStyle={styles.rectangle}>
        <Icon style={{ color: '#000000' }} name='account-circle' type='material' size={75} />

        {isGuest ? (
          <Text style={styles.supportingText}>
            Currently browsing as a guest. Please log in to add user preferences, favourites, and personal notes.
          </Text>
        ) : (
          <Text style={styles.subtitle}>{username}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>SETTINGS</Text>
        </TouchableOpacity>

        {!isGuest && (
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <Card containerStyle={styles.user}>
                <Icon style={styles.userIcon} name='note' type='material' size={40} />
                <Text style={styles.userCount}>{userNotes}</Text>
                <Text style={styles.userText}>Notes</Text>
              </Card>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => router.push('/home')}>
              <Card containerStyle={styles.user}>
                <Icon style={styles.userIcon} name='favorite' type='material' size={40} />
                <Text style={styles.userCount}>{userFavourites}</Text>
                <Text style={styles.userText}>Favourites</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/preferences')}>
              <Card containerStyle={styles.user}>
                <Icon style={styles.userIcon} name='checklist' type='material' size={40} />
                <Text style={styles.userCount}>{userPreferences}</Text>
                <Text style={styles.userText}>Preferences</Text>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {!isGuest && (
          <View style={styles.userContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.signUpButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </Layout>
  );
};

export default UserProfile;