import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Button, Dimensions, ScrollView } from 'react-native';
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
import { styles } from '../styles/app-styles';

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
            <View style={{...styles.flexContainer, paddingHorizontal: 4}}>
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
                  // textStyle={styles.typesText}
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

const filterColours: {[key: string]: {fill: string, border: string}} = {
  'diets': { fill: '#FFE7DC', border: '#FEBFAC' },
  'allergens': { fill: '#F3D9FF', border: '#D59CEF' },
  'ingredients': { fill: '#E4EDFF', border: '#A8C1F3' },
  'cuisine': { fill: '#E7FFE7', border: '#B1F6B1' },
  'selected': { fill: '#E8DEF8', border: '#BDB0CA' }
}
const {width} = Dimensions.get('window');

export default Map;