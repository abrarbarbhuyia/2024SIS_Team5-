import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, ScrollView } from 'react-native';
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

const RestaurantMap = () => {
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const [markerLocation, setMarkerLocation] = useState<{name: string, lat: number, long: number}[]>([
    {name: 'Pane e Vino', lat: -33.88087996454809, long: 151.2097105847393}]);

  const filterTypes = ['diets', 'allergens', 'ingredients', 'cuisine'];
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
                iconStyle={styles.icon}
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
              {markerLocation.length > 0 && markerLocation.map((m, i) => 
              <Marker
               key={`marker-${i}`}
                coordinate={{ latitude: m.lat, longitude: m.long }}
                title={m.name}>
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
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  map: {
    minWidth: 300,
    width: width,
    height: '86%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E6D7FA',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  baseCard: {
    maxHeight: height-160,
    maxWidth:width+2,
    backgroundColor: "#FBF8FF",
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  filterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 20,
    minHeight: 30,
    width: '100%',
    paddingHorizontal: 10

  },
  typesBackground: {
    backgroundColor: '#FBF8FF',
    height: 28,
    paddingLeft: 4,
    paddingRight: 4,
    borderStyle: 'solid',
    borderColor: '#79747E',
  },
  typesText: {
    color: '#281554',
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: -0.4,
  },
  filterCheck: {
    color:'#534072',
    marginRight: 5,
  },
  filterBackground: {
    backgroundColor: '#FBF8FF',
    height: 22,
    paddingHorizontal: 4,
    borderStyle: 'solid',
    borderColor: '#79747E',
  },
  filterText: {
    color: '#281554',
    fontWeight: '300',
    fontSize: 11,
    textAlign: 'center',
  },
  badgesCross: {
    color: '#BCBCBC',
    paddingLeft: 4,
    height: 12,
    width: 20,
  },
  card: {
    backgroundColor: '#FBF8FF',
    padding: 20,
    borderRadius: 20,
  },
  icon: {
    color:'#534072',
    paddingHorizontal: 8,
  },
  badgeScrollView: {
    flexDirection: 'row',
    gap: 4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  innerIcon: {
    position: 'absolute',
  },
  innerCircle: {
    position: 'absolute', 
    backgroundColor: '#CB4C4E',
    borderRadius: 20, 
    width: 20,
    height: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -5 }]
  },
  filledCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 12.5, 
    borderStyle:'solid',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#0B84FF',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
  },
});

export default RestaurantMap;