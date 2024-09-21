import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { styles } from '../styles/app-styles'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    try {
      const HOST_IP = '' // add your IP address here
      const response = await axios.post(`http://${HOST_IP}:4000/register`, { username, password });
      Alert.alert('Registration Successful', `Welcome ${username}!`);
      router.push('/login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response.data.message || 'Unable to register. Try again later.');
    }
  }, [username, password, confirmPassword]);

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Image source={require('../assets/images/food-for-thought-logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Create an Account</Text>
        <Text style={styles.supportingText}>Already have an account?{' '}
          <Text style={styles.registerText} onPress={() => router.push('/login')}>Log in here.</Text>
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <Icon name="user" size={20} color="#7E7093" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Icon name="lock" size={20} color="#7E7093" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Icon name="lock" size={20} color="#7E7093" style={styles.icon} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;