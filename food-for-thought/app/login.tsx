import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = useCallback(() => {
    if (username === 'admin' && password === 'testpasswordnotreal') {
      Alert.alert('Login Successful', `Welcome ${username}!`);
    } else {
      Alert.alert('Login Failed', 'Invalid username or password. Try again.');
    }
  }, [username, password]);

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Image 
          source={require('../assets/images/food-for-thought-logo.png')}
          style={styles.logo}
        />

        <Text style={styles.headline}>Login</Text>
        <Text style={styles.supportingText}>New to Food For Thought? Sign up for free.</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Login"
          onPress={handleLoginPress}
          color="#5A428F"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    headline: {
      fontFamily: 'Roboto',
      fontWeight: '600',
      fontSize: 24,
      lineHeight: 32,
      color: '#1D1B20',
      marginBottom: 20,
    },
    supportingText: {
      width: '100%',
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      color: '#49454F',
      marginBottom: 30,
    },
    input: {
      width: '100%',
      height: '10%',
      borderColor: '#CCCCCC',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10,
      marginBottom: 20,
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#808080',
    },
  });

export default Login;