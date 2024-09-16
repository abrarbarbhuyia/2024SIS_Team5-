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

const Map = () => {
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const filterTypes = ['diets', 'allergens', 'ingredients', 'cuisine'];
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Header />
        <Card containerStyle={styles.baseCard}>
          <View style={{ flexDirection: 'column', rowGap: 2}}>
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
                        {capitaliseFirstLetter(f.value)}
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
            <View style={{...styles.flexContainer, paddingHorizontal: 8}}>
              {filterTypes.map(f =>
                <Badge 
                  badgeStyle={{...styles.typesBackground, 
                    ...(filterType === f && { 
                      backgroundColor: filterColours['selected'].fill, 
                      borderColor: filterColours['selected'].border 
                    }), 
                  }}
                  textStyle={styles.typesText}
                  // value={capitaliseFirstLetter(f)}
                  value={f.toUpperCase()}
                  key={f}
                  onPress={() => setFilterType(f)} />)}
            </View>
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
        <Card containerStyle={styles.baseCard}>
          <Text>Add Map viewer here</Text>
          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          />
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

export function capitaliseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const filterColours: {[key: string]: {fill: string, border: string}} = {
  'diets': { fill: '#FFE7DC', border: '#FEBFAC' },
  'allergens': { fill: '#F3D9FF', border: '#D59CEF' },
  'ingredients': { fill: '#E4EDFF', border: '#A8C1F3' },
  'cuisine': { fill: '#E7FFE7', border: '#B1F6B1' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
}
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
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
    maxHeight: 200,
    width: width - 32,
    height: 170,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 20,
    minHeight: 30,
    width: '100%',

  },
  typesBackground: {
    backgroundColor: '#FBF8FF',
    height: 28,
    paddingLeft: 4,
    paddingRight: 4,
    borderStyle: 'solid',
    borderColor: '#79747E',  
    width: 85,
  },
  typesText: {
    color: '#281554',
    fontWeight: '500',
    fontSize: 9,
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
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
  },
  badgesCross: {
    color: '#DADADA',
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
});

export default Map;