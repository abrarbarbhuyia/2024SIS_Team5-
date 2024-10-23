import { Overlay } from "@rneui/themed";
import { Text, TouchableOpacity } from 'react-native';
import React from "react";
import { styles } from '../styles/app-styles';

interface SafetyWarningProps {
  handleNotedPress: () => void;
}

const SafetyWarning: React.FC<SafetyWarningProps> = ({ handleNotedPress }) => {
  return (
    <Overlay 
      isVisible={true}
      overlayStyle={[styles.modal, { backgroundColor: 'rgba(255, 255, 255, 1)', shadowOpacity: 0 }]}
      onBackdropPress={() => {}}
      animationType="fade"
    >
      <Text style={styles.subtitle}>WARNING</Text>
      <Text style={styles.supportingText}>
        Food for Thought uses AI to provide dietary and allergy-related recommendations.
        We cannot guarantee 100% accuracy. 
        Please consult a healthcare professional before relying on any dietary information provided by the app.
        Always check with restaurant staff before dining.
      </Text>
      <TouchableOpacity style={[styles.button, { marginTop: -10 }]} onPress={ handleNotedPress }>
        <Text style={styles.buttonText}>NOTED</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

export default SafetyWarning;