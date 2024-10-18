import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@rneui/themed';
import { styles } from '../styles/app-styles'; 
import Constants from 'expo-constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  const handleLogin = useCallback(async () => {
    try {
      const response = await axios.post(`http://${HOST_IP}:4000/login`, { username, password });
      await AsyncStorage.setItem('token', response.data.token);
      router.push('/home'); 
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Invalid username or password. Try again.');
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

        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default Login;