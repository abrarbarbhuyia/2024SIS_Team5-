import { Overlay } from "@rneui/themed";
import { Text, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { styles } from '../styles/app-styles';
import { router } from 'expo-router';

const SafetyWarning = () => {
  const [visible, setVisible] = useState(true);

  const handleNotedPress = () => {
    setVisible(false);
    router.replace('/map');
  };

  return (
    <Overlay isVisible={visible} overlayStyle={styles.modal}>
        <Text style={styles.subtitle}>Warning</Text>
        <Text style={styles.supportingText}>
          Food for Thought uses AI to provide dietary and allergy-related recommendations.
          We cannot guarantee 100% accuracy. 
          Please ensure to consult a healthcare professional before relying on any dietary information provided by the app.
          Always check with resturant staff before dining.
        </Text>
        <TouchableOpacity style={[styles.button, {marginTop: -10}]} onPress={handleNotedPress}>
          <Text style={styles.buttonText}>NOTED</Text>
        </TouchableOpacity>
    </Overlay>
  );
}

export default SafetyWarning;