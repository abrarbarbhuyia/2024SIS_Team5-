import React, { useState, useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

type SearchBarComponentProps = {
  onSearch: (searchTerm: string) => void;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const route = useRoute();

  useEffect(() => {
    const currentPage = route.name;
    switch (currentPage) {
      case 'home':
        setPlaceholder('Search by dietary requirement...');
        break;
      default:
        setPlaceholder('Search nearby restaurants...');
        break;
    }
  }, [route.name]);

  const updateSearch = (search: string) => {
    setSearch(search);
    onSearch(search);
  };

  return (
    <View style={styles.view}>
      <SearchBar
        placeholder={placeholder}
        onChangeText={updateSearch}
        value={search}
        searchIcon={{ color: '#28005D' }}
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
  view: { margin: 5 },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E6D7FA',
    borderWidth: 1,
    alignContent: 'center',
    borderBottomWidth: 1,
  },
  input: {
    fontFamily: 'Roboto',
    fontSize: 18,
  },
});

export default SearchBarComponent;