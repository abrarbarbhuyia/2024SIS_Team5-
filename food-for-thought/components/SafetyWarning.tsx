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
      overlayStyle={[styles.modal, { backgroundColor: 'rgba(255, 255, 255, 1)', shadowOpacity: 0, paddingVertical: 20 }]}
      onBackdropPress={() => {}}
      animationType="fade"
    >
      <Text style={styles.subtitle}>WARNING</Text>
      <Text style={styles.supportingText}>
        Food for Thought uses AI to provide dietary and allergy-related recommendations. {"\n"}
        We cannot guarantee 100% accuracy. {"\n"}{"\n"}
        Please consult a healthcare professional before relying on any dietary information given by the app.{"\n"}
        Always check with restaurant staff before dining.
      </Text>
      <TouchableOpacity style={[styles.button, { marginTop: -10 }]} onPress={ handleNotedPress }>
        <Text style={styles.buttonText}>NOTED</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

export default SafetyWarning;