import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@rneui/themed';
// import { HOST_IP } from '@env';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    try {
      const HOST_IP = '172.19.147.72' // add your IP address here
      const response = await axios.post(`http://${HOST_IP}:4000/login`, { username, password });
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Login Successful', `Welcome ${username}!`);
      router.push('/home'); 
    } catch (error: any) {
      Alert.alert('Login Failed', error.response.data.message || 'Invalid username or password. Try again.');
    }
  }, [username, password]);

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.rectangle}>
        <Image source={require('../assets/images/food-for-thought-logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Login</Text>
        <Text style={styles.supportingText}>New to Food For Thought?{'\n'}
          <Text style={styles.registerText} onPress={() => router.push('/register')}>Sign up for free!</Text>
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Username
          </Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <Icon name="user" size={20} color="#7E7093" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Icon name="lock" size={20} color="#7E7093" style={styles.icon} />
        </View>

        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
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
    alignSelf: 'center'
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: '#1D1B20',
    marginBottom: 20,
    textAlign: 'center',
  },
  supportingText: {
    paddingBottom: 8,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#49454F',
    marginBottom: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    minWidth: '80%',
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'transparent',
    top: -18,
    fontSize: 12,
    color: '#7E7093',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#808080',
  },
  button: {
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A428F',
    borderColor: '#484DBE',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    padding: 7,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    bottom: 30,
    right: -10,
    zIndex: 9000,
  },
  registerText: {
    textDecorationLine: 'underline',
    color: '#5A428F',
  },
});

export default Login;