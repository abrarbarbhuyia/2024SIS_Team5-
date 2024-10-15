import { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/app-styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Slider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Header from "@/components/Header";

const Settings = () => {
  const [filterByDietary, setFilterByDietary] = useState(true);
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState(10);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedFilterByDietary = await AsyncStorage.getItem('filterByDietary');
        const storedLocation = await AsyncStorage.getItem('location');
        const storedDistance = await AsyncStorage.getItem('distance');

        if (storedFilterByDietary !== null) setFilterByDietary(JSON.parse(storedFilterByDietary));
        if (storedLocation !== null) setLocation(storedLocation);
        if (storedDistance !== null) setDistance(parseInt(storedDistance));
      } catch (error) {
        console.error('Error loading settings', error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('filterByDietary', JSON.stringify(filterByDietary));
        await AsyncStorage.setItem('location', location);
        await AsyncStorage.setItem('distance', distance.toString());
      } catch (error) {
        console.error('Error saving settings', error);
      }
    };

    saveSettings();
  }, [filterByDietary, location, distance]);

  const toggleSwitch = () => setFilterByDietary((prevState) => !prevState);

  return (
    <View style={styles.container}>
      <Header />
      <Card containerStyle={styles.rectangle}>
        <Text style={[styles.subtitle, { right: 110 }]}>Settings</Text>

        <View>
          <Text style={styles.headline}>Account</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/user')}>
            <Text style={styles.listItemText}>Profile</Text>
            <Icon name="chevron-right" size={16} color="#49454F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/changepassword')}>
            <Text style={styles.listItemText}>Change Password</Text>
            <Icon name="chevron-right" size={16} color="#49454F" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/preferences')}>
            <Text style={styles.listItemText}>Change Dietary Preferences</Text>
            <Icon name="chevron-right" size={16} color="#49454F" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.headline}>Restaurant Search</Text>

          <View style={[styles.switchRow]}>
            <Text style={styles.switchLabel}>Filter by Dietary Preferences</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#65558F' }}
              thumbColor={filterByDietary ? '#FFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={filterByDietary}
            />
          </View>

          <View style={styles.settingsInputContainer}>
            <Text style={styles.label}>Manually Input Location</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.locationInput}
                value={location}
                onChangeText={setLocation}
              />
              <Icon name="location-arrow" size={20} color="#7E7093" style={styles.locationIcon} />
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Maximum Distance</Text>
            <Text style={styles.sliderText}>{distance} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              minimumTrackTintColor="#65558F"
              maximumTrackTintColor="#000000"
              thumbTintColor="#65558F"
              value={distance}
              onValueChange={(value) => setDistance(value)}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default Settings;