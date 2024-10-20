import { Button, Icon, Overlay, Avatar, ListItem, Divider, CheckBox } from "@rneui/themed";
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as React from "react";
import { capitaliseFirstLetter, formatTextValue } from "@/utils";

export type DietaryFilterProps = {
  setShowModal: React.Dispatch<React.SetStateAction<string | undefined>>,
  setActiveFilters: React.Dispatch<React.SetStateAction<{ type: string, value: string }[]>>,
  currentFilters: { type: string, value: string }[],
  filterType: string,
};

export function DietaryFilterModal({ filterType, currentFilters, setActiveFilters, setShowModal, ...rest }: DietaryFilterProps) {
  const [newFilter, setNewFilter] = React.useState<string>();
  const allergens = ['nuts', 'eggs', 'soy', 'crustaceans', 'fish', 'milk', 'peanuts', 'sesame', 'wheat', 'lupin'];
  const diets = ['vegetarian', 'vegan', 'halal', 'gluten-free', 'keto', 'fodmap', 'lactose-free', 'low-sugar', 'pescatarian'];
  const cuisine = ['thai', 'indian', 'italian', 'chinese', 'japanese', 'mexican', 'korean', 'french', 'greek', 'turkish', 'vietnamese'];

  function addFilter(value: string) {
    if (value === null) return;
    const formattedValue = formatTextValue(value);
    if (currentFilters.length > 0) {
      !(currentFilters.find(cur => (cur.type === filterType) && (cur.value === formattedValue)))
        ? setActiveFilters(currentFilters.concat([{ type: filterType, value: formattedValue }]))
        : null;
    } else {
      setActiveFilters([{ type: filterType, value: formattedValue }]);
    }
    setNewFilter(undefined);
    return;
  }

  function onCheckFilter(value: string) {
    if (value === null) return;
    const formattedValue = formatTextValue(value);
    if (currentFilters.find(cur => (cur.type === filterType) && (cur.value === formattedValue))) {
      setActiveFilters(currentFilters.filter(filter => !((filter.type === filterType) && (filter.value === formattedValue))));
    } else {
      addFilter(formattedValue);
    }
  }

  return <Overlay overlayStyle={styles.modal} isVisible={true}
    onBackdropPress={() => setShowModal(undefined)}>
    <View style={styles.flexFormGroup}>
      <TextInput
        style={styles.input}
        placeholder={`Enter ${filterType ? (filterType + '...') : 'ingredient...'}`}
        value={newFilter}
        onChangeText={(value) => setNewFilter(value)} />
      {filterType &&
        <Button buttonStyle={styles.button} onPress={() => newFilter && addFilter(newFilter)}>
          <Icon
            name='plus'
            type='feather'
            iconStyle={styles.icon}
            size={22} />
        </Button>}
    </View>
    <Divider style={{ marginBottom: 10 }} />
    {filterType === 'allergens' ?
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {allergens.concat(currentFilters.filter(f => (f.type === 'allergens') && (!allergens.includes(f.value))).map(f => f.value) ?? []).map(a => (
          <ListItem bottomDivider containerStyle={styles.listItem} key={`${a}-allergens`}>
            <Avatar
              size={32}
              rounded
              title={a[0].toUpperCase()}
              containerStyle={{ backgroundColor: "purple" }} />
            <ListItem.Content>
              <ListItem.Title>{capitaliseFirstLetter(a)}</ListItem.Title>
            </ListItem.Content>
            <CheckBox
              key={`${a}-allergens-checkbox`}
              checked={currentFilters
                ? currentFilters.find(cur => (cur.type === filterType) && (cur.value === formatTextValue(a))) ? true : false
                : false}
              onPress={() => onCheckFilter(a)}
              checkedColor="#5A428F"
              uncheckedColor="#BCBCBC"
              checkedIcon={
                <Icon
                  name="check-box"
                  type="material"
                  color="#5A428F"
                  size={25}
                  iconStyle={styles.checkboxIcon}
                />
              }
              size={25}
              containerStyle={styles.checkBoxContainer}
            />
          </ListItem>))}
      </ScrollView>
      : filterType === 'diets' ?
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {diets.concat(currentFilters.filter(f => (f.type === 'diets') && (!diets.includes(f.value))).map(f => f.value) ?? []).map(d => (
            <ListItem bottomDivider containerStyle={styles.listItem} key={`${d}-diets`}>
              <Avatar
                size={32}
                rounded
                title={d[0].toUpperCase()}
                containerStyle={{ backgroundColor: "purple" }} />
              <ListItem.Content>
                <ListItem.Title>{capitaliseFirstLetter(d)}</ListItem.Title>
              </ListItem.Content>
              <CheckBox
                key={`${d}-diets-checkbox`}
                checked={currentFilters
                  ? currentFilters.find(cur => (cur.type === filterType) && (cur.value === formatTextValue(d))) ? true : false
                  : false}
                onPress={() => onCheckFilter(d)}
                containerStyle={styles.checkBoxContainer}
                checkedColor="#5A428F"
                uncheckedColor="#BCBCBC"
                checkedIcon={
                  <Icon
                    name="check-box"
                    type="material"
                    color="#5A428F"
                    size={25}
                    iconStyle={styles.checkboxIcon}
                  />
                }
                size={25}
              />
            </ListItem>))}
        </ScrollView>
        : filterType === 'cuisine' ?
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            {cuisine.concat(currentFilters.filter(f => (f.type === 'cuisine') && (!diets.includes(f.value))).map(f => f.value) ?? []).map(d => (
              <ListItem bottomDivider containerStyle={styles.listItem} key={`${d}-cuisine`}>
                <Avatar
                  size={32}
                  rounded
                  title={d[0].toUpperCase()}
                  containerStyle={{ backgroundColor: "purple" }} />
                <ListItem.Content>
                  <ListItem.Title>{capitaliseFirstLetter(d)}</ListItem.Title>
                </ListItem.Content>
                <CheckBox
                  key={`${d}-cuisine-checkbox`}
                  checked={currentFilters
                    ? currentFilters.find(cur => (cur.type === filterType) && (cur.value === formatTextValue(d))) ? true : false
                    : false}
                  onPress={() => onCheckFilter(d)}
                  containerStyle={styles.checkBoxContainer}
                  checkedColor="#5A428F"
                  uncheckedColor="#BCBCBC"
                  checkedIcon={
                    <Icon
                      name="check-box"
                      type="material"
                      color="#5A428F"
                      size={25}
                      iconStyle={styles.checkboxIcon}
                    />
                  }
                  size={25}
                />
              </ListItem>))}
          </ScrollView>
          : filterType === 'meals' ?
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              {(currentFilters?.filter(f => f.type === 'meals') ?? []).map(f =>
                <ListItem bottomDivider containerStyle={styles.listItem} key={`${f.value}-meals`}>
                  <Avatar
                    size={32}
                    rounded
                    title={f.value[0].toUpperCase()}
                    containerStyle={{ backgroundColor: "purple" }} />
                  <ListItem.Content>
                    <ListItem.Title>{capitaliseFirstLetter(f.value)}</ListItem.Title>
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
            : <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              {(currentFilters?.filter(f => f.type === 'ingredients') ?? []).map(f =>
                <ListItem bottomDivider containerStyle={styles.listItem} key={`${f.value}-ingredients`}>
                  <Avatar
                    size={32}
                    rounded
                    title={f.value[0].toUpperCase()}
                    containerStyle={{ backgroundColor: "purple" }} />
                  <ListItem.Content>
                    <ListItem.Title>{capitaliseFirstLetter(f.value)}</ListItem.Title>
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
            </ScrollView>}
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
    paddingBottom: 0,
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
    color: 'white',
  },
  checkboxIcon: {
    marginRight: 3
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
    paddingVertical: 10
  },
  scrollView: {
    maxHeight: 270,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
});