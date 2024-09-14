import React, { useState, useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

type SearchBarComponentProps = {};

const SwitchComponent: React.FunctionComponent<SearchBarComponentProps> = () => {
const [search, setSearch] = useState("");
const [placeholder, setPlaceholder] = useState("");
const route = useRoute();

useEffect(() => {
    const currentPage = route.name; // use the route name to find current page

    // determine placeholder text based on current page
    switch (currentPage) {
      case 'index':
        setPlaceholder('Search by dietary requirement...');
        break;
      default:
        setPlaceholder(''); // if not index, it'll be 'map' - put this as default for now because SearchBar isn't used anywhere else
        break;
    }
  }, [route.name]); // whenever the route changes, the useEffect will trigger

const updateSearch = (search: string) => {
    setSearch(search);
};

return (
  <View style={styles.view}>
    <SearchBar
      placeholder={placeholder}
      onChangeText={updateSearch}
      value={search}
      searchIcon={{color: '#28005D'}}
      placeholderTextColor='#CAC4D0'
      round={true}
      containerStyle={styles.searchBarContainer}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      platform="default"
    />
  </View>
);
};

const styles = StyleSheet.create({
  view: {
    margin: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent', // remove default component background
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: '#F5F5F5', // change background of input container
    borderColor: '#E6D7FA',
    borderWidth: 1,
    alignContent: 'center',
    borderBottomWidth: 1,
  },
  input: {
    fontFamily: 'Roboto',
    fontSize: 18, // placeholder font size
  },
});

export default SwitchComponent;