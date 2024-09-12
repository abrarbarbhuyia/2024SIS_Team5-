import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:4000/register', {
        username,
        password,
      });

      Alert.alert('Registration Successful', `Welcome ${username}!`);

      router.push('/login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Unable to register. Try again later.');
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

const styles = StyleSheet.create({
  // Same styles as before
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6D7FA',
  },
  rectangle: {
    width: '90%',
    padding: '10%',
    backgroundColor: '#FBF8FF',
    borderRadius: 20,
    alignItems: 'center',
  },
  logo: {
    width: 124,
    height: 59,
    borderRadius: 5,
    marginBottom: 20,
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: '#1D1B20',
    marginBottom: 20,
  },
  supportingText: {
    width: '100%',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#49454F',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
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
    fontWeight: 600,
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
    width: '50%',
    height: '10%',
    backgroundColor: '#5A428F',
    borderColor: '#484DBE',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Register;
