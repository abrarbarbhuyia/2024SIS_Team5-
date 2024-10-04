import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from '@rneui/themed';
import { styles } from '../styles/app-styles';

const Settings = () => {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.rectangle}>
        <Text style={[styles.headline, { fontSize: 32 }]}>Settings</Text>
        <Icon name="user" size={32} color="#000" style={[styles.icon, { left: 47, top: 20 }]} />
        <Text style={[styles.headline, { fontSize: 22 }]}>Account</Text>
        <Text style={[styles.headline]}>Profile</Text>

        <View style={[styles.divider]}></View>
        <View style={[styles.divider]}></View>

        <View style={styles.switch}>
            <View style={styles.switchHandle}></View>
        </View>
      </Card>
    </View>
  );
};

export default Settings;
