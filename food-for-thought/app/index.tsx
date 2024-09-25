import { Card } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Index() {

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.rectangle}>
        <Image source={require('../assets/images/food-for-thought-logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Welcome!</Text>
        <Text style={styles.supportingText}>Welcome to Food for Thought,{'\n'}find restaurants for your dietary needs.</Text>

        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/register')}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.guestText} onPress={() => router.push('/home')}>Continue as a guest</Text>
        <Text style={styles.supportingText}>Your preferences won't be saved!</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6D7FA',
    fontFamily: 'Roboto',
  },
  rectangle: {
    width: '90%',
    paddingVertical: 20,
    backgroundColor: '#FBF8FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
  },
  logo: {
    width: 124,
    height: 59,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 15,
    alignSelf: 'center',
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: '#1D1B20',
    marginBottom: 20,
    textAlign: 'center'
  },
  supportingText: {
    maxWidth: '80%',
    paddingBottom: 8,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#49454F',
    alignSelf: 'center',
  },
  loginButton: {
    marginTop: 15,
    marginBottom: 10,
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A428F',
    borderColor: '#484DBE',
    borderWidth: 1,
    borderRadius: 20,
    padding: 7,
    alignSelf: 'center'
  },
  signUpButton: {
    marginBottom: 15,
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBF8FF',
    borderColor: '#5A428F',
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButtonText: {
    color: '#5A428F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestText: {
    paddingTop: 6,
    color: '#720BC4',
    textAlign: 'center',
  },
});
