import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Card } from '@rneui/themed';
import { styles } from '../styles/app-styles'; 
import Constants from 'expo-constants';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`http://${HOST_IP}:4000/register`, { username, password });
      router.push('/login');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Unable to register. Try again later.');
    }
  }, [username, password, confirmPassword]);

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.rectangle}>
        <Image source={require('../assets/images/food-for-thought-logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Create an Account</Text>
        <Text style={styles.supportingText}>Already have an account?{'\n'}
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

        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default Register;