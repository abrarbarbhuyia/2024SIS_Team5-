import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card } from '@rneui/themed';
import { router } from 'expo-router';
import Header from "@/components/Header";     
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async () => {
  if (await AsyncStorage.getItem('token')) {
    AsyncStorage.removeItem('token');
  }
  router.push('/'); 
};

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Header />

      <Card containerStyle={styles.profileCard}>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userDetails}>johndoe@example.com</Text>
        <Text style={styles.userDetails}>Member since 2023</Text>
      </Card>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leadingIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  trailingIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  headline: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1B20',
  },
  profileCard: {
    width: '90%',
    alignItems: 'center',
    marginTop: 144,
    paddingVertical: 20,
    backgroundColor: '#FBF8FF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E1C49',
  },
  userDetails: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    width: '50%',
    backgroundColor: '#5A428F',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;