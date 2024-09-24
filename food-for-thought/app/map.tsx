import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import SearchBar from "@/components/SearchBar";
import { Badge, Card, Icon } from "@rneui/themed";
import { useState } from "react";
import { DietaryFilterModal } from '@/components/DietaryFilterModal';
import Header from '@/components/Header';
import { capitaliseFirstLetter } from '@/utils';
import MapView, { Marker } from 'react-native-maps';
import { RestaurantModal } from '@/components/RestaurantModal';
import { styles } from '../styles/app-styles'; 

export type Restaurant = {
  name: string,
  address: string,
  openingTimes?: string,
  cuisine?: string,
  // star rating out of 5
  rating?: number,
  // cost rating out of 'affordable' | 'average' | 'expensive'
  costRating?: string,
  // distance in kilometers
  distance?: number,
  // number of matching menu items to current dietary filters
  menuMatches?: number,
}

const exampleRestaurant = {
  name: 'Mother Chus Kitchen',
  address: '367 Pitt Street, Sydney NSW 2000',
  openingTimes: 'Today, 9am to 5pm',
  rating: 4.3,
  cuisine: 'asian',
  costRating: 'average',
  distance: 1.2,
  menuMatches: 25,
}

const RestaurantMap = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const [markers, setMarkers] = useState<{name: string, lat: number, long: number}[]>([
    {name: 'Pane e Vino', lat: -33.88087996454809, long: 151.2097105847393}]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | undefined>();

  const filterTypes = ['diets', 'allergens', 'ingredients', 'cuisine'];
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Header />
        <Card containerStyle={styles.baseCard}>
          <View style={{ flexDirection: 'column', rowGap: 2}}>
            {/* <Button
              onPress={handlePresentModalPress}
              title="Present Modal"
              color="black"
            /> */}
            <SearchBar />
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
                      borderColor: filterColours[f.type]?.border ?? 'white'}}
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
                    </Text>} />) : <Text style={{color: 'grey', fontSize: 12, paddingTop: 5}}>No filters set</Text>} 
                  </ScrollView>
            </View>
            <View style={{...styles.flexContainer, paddingBottom: 6 }}>
              {filterTypes.map(f =>
                <Badge 
                  containerStyle={{ flex: 1 }}
                  badgeStyle={{...styles.typesBackground, 
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
              initialRegion={{ // initial region is hardcoded to UTS Tower
                latitude: -33.88336558611229,
                longitude: 151.2009263036271,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker 
                coordinate={{ latitude:  -33.88336558611229, longitude: 151.2009263036271 }}
                title={"My location"} >
                <View style={styles.filledCircle} />
              </Marker>
              {markers.length > 0 && markers.map((m, i) => 
              <Marker
                key={`marker-${i}`}
                coordinate={{ latitude: m.lat, longitude: m.long }}
                onPress={() => setActiveRestaurant(exampleRestaurant)}>
                <View style={styles.markerContainer}>
                  <Icon
                    name="map-marker"
                    type="material-community"
                    color="#CB4C4E"
                    size={50}
                  />
                  <View style={styles.innerCircle}>
                    <Icon
                      name="food"
                      type="material-community"
                      color="white"
                      size={18}
                    />
                  </View>
                </View>
              </Marker>)}
            </MapView>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetView style={styles.contentContainer}>
                <Text>Awesome 🎉</Text>
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

const filterColours: {[key: string]: {fill: string, border: string}} = {
  'diets': { fill: '#FFE7DC', border: '#FEBFAC' },
  'allergens': { fill: '#F3D9FF', border: '#D59CEF' },
  'ingredients': { fill: '#E4EDFF', border: '#A8C1F3' },
  'cuisine': { fill: '#E7FFE7', border: '#B1F6B1' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
}

export default RestaurantMap;