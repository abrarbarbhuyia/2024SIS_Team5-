import {
  Button,
  Icon,
  Overlay,
  Avatar,
  ListItem,
  Divider,
  CheckBox,
} from "@rneui/themed";
import { View, StyleSheet, TextInput, Text, ScrollView, Modal } from "react-native";
import * as React from "react";
import { capitaliseFirstLetter, formatTextValue } from "@/utils";

export type DietaryChoiceProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isVisible: boolean;
};

export function DietaryChoiceModal({
  setShowModal,
  isVisible,
}: DietaryChoiceProps) {
  return (
    <Overlay
      overlayStyle={styles.modal}
      isVisible={isVisible}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBF8FF",
    borderRadius: 20,
    width: "90%",
    padding: 15,
  },
  flexFormGroup: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingBottom: 0,
    paddingHorizontal: 40,
    flexDirection: "row",
    gap: 15,
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    color: "#281554",
    paddingVertical: 15,
  },
  input: {
    width: "100%",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontFamily: "Roboto",
    fontSize: 15,
    color: "#808080",
    height: 38,
  },
  icon: {
    color: "white",
  },
  checkboxIcon: {
    marginRight: 3,
  },
  button: {
    backgroundColor: "#5A428F",
    height: 38,
  },
  badgesCross: {
    color: "#BCBCBC",
  },
  listItem: {
    width: "100%",
    backgroundColor: "inherit",
    paddingVertical: 10,
  },
  scrollView: {
    maxHeight: 270,
    width: "100%",
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
});
