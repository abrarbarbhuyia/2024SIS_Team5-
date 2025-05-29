import React, { useState, useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { currentFont } from '@/styles/app-styles';

type SearchBarComponentProps = {
  onSearch: (searchTerm: string) => void;
  currentPage?: string;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({ onSearch, currentPage = 'default' }) => {
  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    switch (currentPage) {
      case 'home':
        setPlaceholder('Search by dietary requirement...');
        break;
      default:
        setPlaceholder('Search nearby restaurants...');
        break;
    }
  }, [currentPage]);

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
    fontSize: 18,
    ...currentFont,
  },
});

export default SearchBarComponent;