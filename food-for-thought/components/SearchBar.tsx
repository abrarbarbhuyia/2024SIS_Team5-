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
      case 'home':
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
      lightTheme={true}
    />
  </View>
);
};

const styles = StyleSheet.create({
  view: {
    margin: 5,
  },
});

export default SwitchComponent;