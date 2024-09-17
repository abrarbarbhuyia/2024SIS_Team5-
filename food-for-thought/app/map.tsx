import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import SearchBarComponent from "@/components/SearchBar";
import { Badge, Icon } from "@rneui/themed";
import { DietaryFilterModal } from '@/components/DietaryFilterModal';
import Header from '@/components/Header';
import axios from 'axios';
import { HOST_IP } from '@env';
import { capitaliseFirstLetter } from '@/utils';

const Map = () => {
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filterTypes = ['diets', 'allergens', 'ingredients'];

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`http://${HOST_IP}:4000/search`, {
        params: {
          ingredientFilter: (activeFilters?.filter(f => f.type === 'ingredients') || []).map(f => f.value)[0] || "",
          allergens: (activeFilters?.filter(f => f.type === 'allergens') || []).map(f => f.value) || [],
          diets: (activeFilters?.filter(f => f.type === 'diets') || []).map(f => f.value) || [],
          searchQuery: searchTerm
        },
      });
      setRestaurants(response.data);
      bottomSheetModalRef.current?.present();
    } catch (error: any) {
      console.error(error.response.data?.message || 'Error searching restaurants. Try again.');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm, activeFilters]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => console.log(`Clicked restaurant: ${item.name}`)}>
      <View style={styles.restaurantItem}>
        <Text style={styles.restaurantName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Header />
        <View style={styles.searchContainer}>
          <SearchBarComponent onSearch={handleSearch} />
          <View style={styles.filterContainer}>
            <View style={styles.flexContainer}>
              {activeFilters.map(f => (
                <Badge
                  badgeStyle={{ ...styles.filterBackground, backgroundColor: filterColours[f.type].fill, borderColor: filterColours[f.type].border }}
                  textStyle={styles.filterText}
                  key={`${f.type}-${f.value}`}
                  value={
                    <Text style={styles.filterText}>
                      {capitaliseFirstLetter(f.value)}
                      <Icon name='x' type='feather' iconStyle={styles.badgesCross} size={15} onPress={() => setActiveFilters(activeFilters.filter(af => af.value !== f.value))} />
                    </Text>
                  }
                />
              ))}
            </View>
            <View style={styles.flexContainer}>
              {filterTypes.map(f => (
                <Badge
                  badgeStyle={{ ...styles.typesBackground, ...(filterType === f && { backgroundColor: filterColours['selected'].fill, borderColor: filterColours['selected'].border }) }}
                  textStyle={styles.typesText}
                  value={capitaliseFirstLetter(f)}
                  key={f}
                  onPress={() => setFilterType(f)}
                />
              ))}
            </View>
          </View>
        </View>
        <Button onPress={handlePresentModalPress} title="Show Restaurants" color="black" />
        <BottomSheetModal 
          ref={bottomSheetModalRef} 
          index={1} 
          snapPoints={snapPoints} 
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            {restaurants.length > 0 ? (
              <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={item => item.restaurantId}
              />
            ) : (
              <Text style={styles.noResultsText}>No restaurants found.</Text>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
      {filterType && <DietaryFilterModal 
        filterType={filterType} 
        currentFilters={activeFilters}
        setShowModal={setFilterType} 
        setActiveFilters={setActiveFilters} />}
    </BottomSheetModalProvider>
  );
};

const filterColours: { [key: string]: { fill: string, border: string } } = {
  'diets': { fill: '#FFE7DC', border: '#FEBFAC' },
  'allergens': { fill: '#F3D9FF', border: '#D59CEF' },
  'ingredients': { fill: '#E4EDFF', border: '#A8C1F3' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6D7FA' },
  searchContainer: { backgroundColor: '#FBF8FF', borderRadius: 20, padding: 10 },
  filterContainer: { marginVertical: 10 },
  flexContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 4 },
  typesBackground: { backgroundColor: '#FBF8FF', height: 28, paddingLeft: 4, paddingRight: 4, borderRadius: 8, borderColor: '#D7CEE4', borderWidth: 1 },
  typesText: { color: '#625B71', fontFamily: 'Roboto' },
  filterBackground: { backgroundColor: '#E8DEF8', height: 28, paddingLeft: 4, paddingRight: 4, borderRadius: 8, borderWidth: 1 },
  filterText: { color: '#28005D', fontSize: 13 },
  restaurantItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  restaurantName: { fontSize: 18 },
  icon: { color: '#28005D' },
  badgesCross: { color: '#28005D', marginLeft: 8 },
  contentContainer: { flex: 1, padding: 10 },
  noResultsText: { textAlign: 'center', color: '#888', marginTop: 20 }
});

export default Map;