import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SearchBar from "@/components/SearchBar";
import { Badge, Card, Icon } from "@rneui/themed";
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { DietaryFilterModal } from '@/components/DietaryFilterModal';
import Header from '@/components/Header';
import { capitaliseFirstLetter } from '@/utils';
import { RestaurantModal } from '@/components/RestaurantModal';
import { styles } from '../styles/app-styles'; 
import Constants from 'expo-constants';

export type Restaurant = {
  _id: string,
  restaurantId: string,
  name: string,
  address: string,
  latitude: string,
  longitude: string,
  openingHours?: [{ 
    close: string, day: number, open: string
  }],
  phoneNumber?: string,
  website?: string,
  cuisine?: string[],
  // price rating out of 1: cheap, 2: average, 3: expensive, 4: very expensive 
  price?: number,
  // rating out of 10
  rating?: number,
  total_ratings?: 232,
  menuId?: string,
  restaurantPhotos?: string[],
  foodPhotos?: string[],
  hasMenu?: boolean
  // number of matching menu items to the current dietary filters
  menuItemMatches?: number
}

const RestaurantMap = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  // initial region is hardcoded to UTS Tower
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number }>({ 
    latitude: -33.88336558611229,
    longitude: 151.2009263036271,
  })

  const filterTypes = ['diets', 'allergens', 'ingredients', 'cuisine', 'meals'];
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const fetchRestaurants = async () => {
    try {
      const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
      const response = await axios.get(`http://${HOST_IP}:4000/search`, {
        params: {
          ingredientFilter: (activeFilters?.filter(f => f.type === 'ingredients') || []).map(f => f.value)[0] || "",
          allergens: (activeFilters?.filter(f => f.type === 'allergens') || []).map(f => f.value) || [],
          diets: (activeFilters?.filter(f => f.type === 'diets') || []).map(f => f.value) || [],
          cuisine: (activeFilters?.filter(f => f.type === 'cuisine') || []).map(f => f.value) || [],
          meals: (activeFilters?.filter(f => f.type === 'meals') || []).map(f => f.value)[0] || "",
          searchQuery: searchTerm
        },
      });
      setRestaurants(response.data);
      console.log("SEARCH RESTAURANTS", JSON.stringify(response.data[6]));
      bottomSheetModalRef.current?.present();
    } catch (error: any) {
      console.error(error.response.data?.message || 'Error searching restaurants. Try again.');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm, activeFilters]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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
        <Card containerStyle={styles.baseCard}>
          <View style={{ flexDirection: 'column', rowGap: 2 }}>
            <SearchBar onSearch={handleSearch} />
            <View style={styles.flexContainer}>
              <Icon
                name='sliders'
                type='font-awesome'
                iconStyle={styles.mapIcon}
                size={20} />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScrollView}>
                {activeFilters.length > 0 ? activeFilters.map(f => <Badge
                  badgeStyle={{
                    ...styles.filterBackground,
                    backgroundColor: filterColours[f.type]?.fill ?? 'white',
                    borderColor: filterColours[f.type]?.border ?? 'white'
                  }}
                  textStyle={styles.filterText}
                  key={`${f.type}-${f.value}`}
                  value={
                    <Text style={styles.filterText}>
                      {`${f.type === 'allergens' ? 'No' : ''} ${capitaliseFirstLetter(f.value)}`}
                      <Icon
                        name='x'
                        type='feather'
                        iconStyle={styles.badgesCross}
                        size={15}
                        onPress={() => activeFilters.length > 0
                          ? setActiveFilters(activeFilters.filter(filter => !(filter === f)))
                          : null} />
                    </Text>} />) : <Text style={{ color: 'grey', fontSize: 12, paddingTop: 5 }}>No filters set</Text>}
              </ScrollView>
            </View>
            <View style={{ ...styles.flexContainer, paddingBottom: 6 }}>
              {filterTypes.map(f =>
                <Badge
                  containerStyle={{ flex: 1 }}
                  badgeStyle={{
                    ...styles.typesBackground,
                    width: '100%',
                    ...((filterType === f || activeFilters.map(f => f.type).includes(f)) && {
                      backgroundColor: filterColours['selected'].fill,
                      borderColor: filterColours['selected'].border
                    }),
                  }}
                  value={<View style={styles.filterBadgeContainer}>
                    {activeFilters.map(f => f.type).includes(f) && <Icon
                      name='check'
                      type='feather'
                      iconStyle={styles.filterCheck}
                      size={13} />}
                    <Text style={styles.typesText}>
                      {capitaliseFirstLetter(f)}
                    </Text>
                  </View>}
                  key={f}
                  onPress={() => setFilterType(f)} />)}

            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                ...userLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            >
              <Marker
                coordinate={userLocation}
                title={"My location"} >
                <View style={styles.filledCircle} />
              </Marker>
              {restaurants.length > 0 && restaurants.map((r, i) =>
                <Marker
                  key={`marker-${i}`}
                  coordinate={{ latitude: r.latitude, longitude: r.longitude }}
                  onPress={() => setActiveRestaurant(r)}>
                  <View style={styles.markerContainer}>
                    <Icon
                      name="fmd-good"
                      type="material"
                      color="#EA4335"
                      size={40}
                    />
                    <View style={styles.innerCircle}>
                      <Icon
                        name="silverware-fork-knife"
                        type="material-community"
                        color="white"
                        size={16}
                      />
                    </View>
                  </View>
                </Marker>)}
            </MapView>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
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
        </Card>
      </View>
      {filterType && <DietaryFilterModal
        filterType={filterType}
        currentFilters={activeFilters}
        setShowModal={setFilterType}
        setActiveFilters={setActiveFilters} />}
      {activeRestaurant && <RestaurantModal
        setShowModal={setActiveRestaurant} restaurant={activeRestaurant} />}
    </BottomSheetModalProvider>
  );
};

const filterColours: { [key: string]: { fill: string, border: string } } = {
  'diets': { fill: '#F3D9FF', border: '#D59CEF' },
  'allergens': { fill: '#FFDCDC', border: '#FEACAC' },
  'ingredients': { fill: '#E4EDFF', border: '#A8C1F3' },
  'cuisine': { fill: '#FFF2D9', border: '#FFC56F' },
  'meals': { fill: '#DDF8DD', border: '#B5EFB5' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
}

export default RestaurantMap;