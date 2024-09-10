import { Button, Icon, Overlay, Avatar, ListItem, Divider } from "@rneui/themed";
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as React from "react";

export type DietaryFilterProps = {
    setShowModal: React.Dispatch<React.SetStateAction<string | undefined>>,
    setActiveFilters: React.Dispatch<React.SetStateAction<{ type: string, value: string }[]>>,
    currentFilters: { type: string, value: string }[],
    filterType: string,
  };

export function DietaryFilterModal({ filterType, currentFilters, setActiveFilters, setShowModal, ...rest }: DietaryFilterProps) {
  const [newFilter, setNewFilter] = React.useState<string>();

  function addFilter(value: string) {
    if (value === null) return;
    setActiveFilters(currentFilters ? currentFilters.concat([{ type: filterType, value: value }]) : [{ type: filterType, value: value }])
    setNewFilter(undefined);
    return;
  }
  return <Overlay overlayStyle={styles.modal} isVisible={true}
    onBackdropPress={() => setShowModal(undefined)}>
    <View style={styles.flexFormGroup}>
      <TextInput
        style={styles.input}
        placeholder="Type your ingredient..."
        value={newFilter}
        onChangeText={(value) => setNewFilter(value)} />
        <Button buttonStyle={styles.button} onPress={() => newFilter && addFilter(newFilter)}>
        <Icon
          name='plus'
          type='feather'
          iconStyle={styles.icon}
          size={22} />
      </Button>
    </View>
    <Divider style={{ marginBottom: 10}} />

    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      {currentFilters?.map(f => <ListItem bottomDivider containerStyle={styles.listItem} key={f.value}>
        <Avatar
          size={32}
          rounded
          title={f.value[0].toUpperCase()}
          containerStyle={{ backgroundColor: "purple" }} />
        <ListItem.Content>
          <ListItem.Title>{f.value}</ListItem.Title>  
        </ListItem.Content>
        <Icon
            name='x'
            type='feather'
            iconStyle={styles.badgesCross}
            size={20}
            onPress={() => currentFilters.length > 0 
              ? setActiveFilters(currentFilters.filter(filter => !(filter === f))) 
              : null} />
      </ListItem>)}
    </ScrollView>
  </Overlay>
}


const styles = StyleSheet.create({
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FBF8FF',
      borderRadius: 20,
      width: '90%',
      padding: 15,
    },
    flexFormGroup: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 20,
      paddingHorizontal: 40,
      flexDirection: 'row',
      gap: 15,
    },
    title: {
      fontWeight: '600',
      fontSize: 22,
      color: '#281554',
      paddingVertical: 15,
    },
    input: {
      width: '100%',
      borderColor: '#CCCCCC',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      fontFamily: 'Roboto',
      fontSize: 15,
      color: '#808080',
      height: 38,                                       
    },
    icon: {
      color:'white',
    },
    button: {
      backgroundColor: '#5A428F',
      height: 38,
    },
    badgesCross: {
      color: '#BCBCBC',
    },
    listItem: {
      width: '100%',
      backgroundColor: 'inherit',
    },
    scrollView: {
      maxHeight: 270,
      width: '100%',
    },
    scrollViewContent: {
      paddingBottom: 10,
    },
  });