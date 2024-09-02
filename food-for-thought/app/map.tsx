import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import SearchBar from "@/components/SearchBar";
import { Badge, Icon } from "@rneui/themed";
import { useState } from "react";
import { DietaryFilterModal } from '@/components/DietaryFilterModal';

const Map = () => {
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>(
    [{ type: 'diet', value: 'halal' }, { type: 'allergen', value: 'No Nuts' }, { type: 'ingredient', value: 'salmon' }, { type: 'cuisine', value: 'spanish' }]);
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
        <View style={{ backgroundColor: '#FBF8FF', borderRadius: 20, flex: 1, maxHeight: 200 }}>
          <SearchBar />
          <View style={{ flex: 1, maxHeight: 60}}>
            <View style={styles.flexContainer}>
              <Icon
                name='sliders'
                type='font-awesome'
                iconStyle={styles.icon}
                size={20} />
                {activeFilters.map(f =>
                  <Badge 
                    badgeStyle={{ 
                      ...styles.filterBackground, 
                      backgroundColor: filterColours[f.type].fill, 
                      borderColor: filterColours[f.type].border }}
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
                          onPress={() => console.log('hello')} />
                      </Text>} />)}
            </View>
            <View style={{...styles.flexContainer, paddingHorizontal: 8}}>
              {filterTypes.map(f =>
                  <Badge 
                    badgeStyle={{...styles.typesBackground, 
                      ...(filterType === f && { backgroundColor: filterColours['selected'].fill, borderColor: filterColours['selected'].border }), 
                    }}
                    textStyle={styles.typesText}
                    value={capitaliseFirstLetter(f)}
                    key={f}
                    onPress={() => setFilterType(f)} />)}
            </View>
          </View>
          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          />
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
        <View style={{ backgroundColor: '#FBF8FF', borderRadius: 20, flex: 1, maxHeight: '40%', marginTop: 10 }}>
          <Text>Add Map viewer here</Text>
        </View>
      </View>
      {filterType && <DietaryFilterModal filterType={filterType} setShowModal={setFilterType} />}
    </BottomSheetModalProvider>
  );
};

function capitaliseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const filterColours: {[key: string]: {fill: string, border: string}} = {
  'diet': { fill: '#FFE7DC', border: '#FEBFAC' },
  'allergen': { fill: '#F3D9FF', border: '#D59CEF' },
  'ingredient': { fill: '#E4EDFF', border: '#A8C1F3' },
  'cuisine': { fill: '#E7FFE7', border: '#B1F6B1' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    justifyContent: 'center',
    backgroundColor: '#E6D7FA',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  typesBackground: {
    backgroundColor: '#FBF8FF',
    height: 28,
    paddingLeft: 4,
    paddingRight: 4,
    borderStyle: 'solid',
    borderColor: '#79747E',  
    width: 85
  },
  typesText: {
    color: '#281554',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12,
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
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 11,
    textAlign: 'center',
  },
  badgesCross: {
    color: '#DADADA',
    paddingLeft: 4,
    height: 12,
    width: 20
  },
  card: {
    backgroundColor: '#FBF8FF',
    padding: 20,
    borderRadius: 20
  },
  icon: {
    color:'#534072',
    paddingHorizontal: 8,
  },
});

export default Map;