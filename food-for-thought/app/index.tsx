import { Card } from '@rneui/themed';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/app-styles'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const loadUser = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      router.push('/home');
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.loginContainer}>
      <Card containerStyle={styles.rectangle}>
        <Image source={require('../assets/images/food-for-thought-logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Welcome!</Text>
        <Text style={styles.supportingTextHome}>Welcome to Food for Thought,{'\n'}find restaurants for your dietary needs.</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/register')}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.guestText} onPress={() => router.push('/home')}>Continue as a guest.</Text>
        <Text style={styles.supportingTextHome}>Your preferences won't be saved!</Text>
      </Card>
    </View>
  );
};
