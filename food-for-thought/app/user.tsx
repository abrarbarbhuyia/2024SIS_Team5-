import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import Header from "@/components/Header";     
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { styles } from '../styles/app-styles';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [isGuest, setIsGuest] = useState(true);

  const loadUser = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUsername(decodedToken.username);
        setIsGuest(false);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setUsername('');
    setIsGuest(true);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Header />

      <Card containerStyle={styles.rectangle}>
        <Icon style={{ color: '#000000' }} name='account-circle' type='material' size={100} />

        {isGuest ? (
          <Text style={styles.supportingText}>
            Currently browsing as a guest. Please log in to add user preferences, favourites, and personal notes.
          </Text>
        ) : (
          <Text style={styles.subtitle}>{username}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
          <Icon style={{ color: '#000000' }} name='settings' type='material' size={40} />
          <Text style={styles.buttonText}>SETTINGS</Text>
        </TouchableOpacity>

        {!isGuest && (
          <View style={styles.fabContainer}>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <Card containerStyle={styles.fab}>
                <Icon style={styles.fabIcon} name='note' type='material' size={40} />
                <Text style={styles.fabText}>Notes</Text>
              </Card>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => router.push('/home')}>
              <Card containerStyle={styles.fab}>
                <Icon style={styles.fabIcon} name='favorite' type='material' size={40} />
                <Text style={styles.fabText}>Favorites</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/home')}>
              <Card containerStyle={styles.fab}>
                <Icon style={styles.fabIcon} name='checklist' type='material' size={40} />
                <Text style={styles.fabText}>Preferences</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={handleLogout}>
              <Text style={styles.signUpButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </View>
  );
};

export default UserProfile;