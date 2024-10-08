import { Button, Icon, Overlay, Divider, Badge } from "@rneui/themed";
import { View, StyleSheet, Image, Text } from 'react-native';
import * as React from "react";
import { capitaliseFirstLetter, formatTextValue } from "@/utils";
import { Restaurant } from "@/app/map";
import { router } from "expo-router";

export type DietaryFilterProps = {
  setShowModal: React.Dispatch<React.SetStateAction<Restaurant | undefined>>,
  restaurant: Restaurant,
};

export function RestaurantModal({ restaurant, setShowModal, ...rest }: DietaryFilterProps) {

  return <Overlay overlayStyle={styles.modal} isVisible={true} onBackdropPress={() => setShowModal(undefined)}>
    <View style={styles.formHeader}>
      <View style={styles.flexGroup}>
        <View style={styles.imageContainer}>
          <Image />
        </View>
        <View style={styles.iconsContainer}>
          <Icon
            name='x'
            type='feather'
            iconStyle={styles.icon}
            size={22} 
            onPress={() => setShowModal(undefined)}/>
          <Icon
            name='star'
            type='feather'
            iconStyle={styles.icon}
            size={22} />
          <Icon
            name='edit'
            type='feather'
            iconStyle={styles.icon}
            size={22} />
        </View>
      </View>
      {restaurant.name && <View style={styles.formHeaderContainer}>
        <Text style={styles.formHeaderText}>{restaurant.name}</Text>
      </View>}
    </View>
    <View style={styles.verticalFlexFormGroup}>
      <View style={styles.flexFormGroup}>
        <Badge badgeStyle={styles.filterBackground}value={'PERFECT'} textStyle={styles.filterText} />
        <Text style={styles.formDescriptionText}>
          {Math.round(restaurant.rating ?? 0)} out of 10</Text>
          <Icon
            name='star'
            type='font-awesome'
            iconStyle={styles.ratingIcon}
            size={17} />
      </View>
      <View style={styles.flexFormGroup}>
        <Text style={styles.formDescriptionTextBold}>
          {capitaliseFirstLetter(restaurant.cuisine?.toString() ?? '')} • {restaurant.price} cost • km away</Text>
      </View>
      <View style={styles.flexFormGroup}>
        <Text style={styles.formDescriptionTextBold}>
          {restaurant.menuItemMatches} menu items matches your dietary filters!
        </Text>
      </View>
      <View style={styles.flexFormGroup}>
        <Icon
          name='map-pin'
          type='feather'
          iconStyle={styles.icon}
          size={16} />
        <Text style={styles.formDescriptionText}>{restaurant.address}</Text>
      </View>
      <View style={styles.flexFormGroup}>
        <Icon
          name='clock'
          type='feather'
          iconStyle={styles.icon}
          size={16} />
        <Text style={styles.formDescriptionText}>{restaurant.name}</Text>
      </View>
      <View style={{ ...styles.flexFormGroup, paddingBottom: 10 }}>
        <Text style={styles.formDescriptionTextBold}>Matching menu items: </Text>
      </View>
      <Button buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={() => {router.push('/restaurant'); setShowModal(undefined);}} title={('view more').toUpperCase()} />
    </View>
    <Divider style={{ marginBottom: 10 }} />
  </Overlay>
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF8FF',
    borderRadius: 20,
    width: '90%',
    padding: 0,
  },
  flexFormGroup: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    gap: 15,
  },
  verticalFlexFormGroup: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    flexDirection: 'column',
    gap: 10,
  },
  formHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5EAFF',
    width: '100%',
    padding: 20,
    gap: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flexGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    color: '#281554',
    paddingVertical: 15,
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  icon: {
    color: '#281554',
  },
  ratingIcon: {
    color: '#FCBE09',
  },
  button: {
    backgroundColor: '#5A428F',
    height: 38,
    borderRadius: 20,
    paddingHorizontal: 40
  },
  image: {
    width: 50,
    height: 50
  },
  imageContainer: {
    backgroundColor: '#BDB0CA',
    borderRadius: 8,
    overflow: 'hidden',
    width: '90%',
    height: 150,
  },
  iconsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    verticalAlign: 'top',
    height: '100%',
    gap: 8
  },
  formHeaderContainer: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  formHeaderText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#281554',
    justifyContent: 'flex-start',
  },
  formDescriptionText: {
    fontWeight: '400',
    fontSize: 15,
    color: '#281554',
    justifyContent: 'flex-start',
  },
  formDescriptionTextBold: {
    fontWeight: '500',
    fontSize: 16,
    color: '#281554',
    justifyContent: 'flex-start',
  },
  filterBackground: {
    backgroundColor: '#16D59C',
    height: 22,
    marginTop: -2,
    paddingHorizontal: 6,
    borderStyle: 'solid',
    borderColor: '#79747E',
  },
  filterText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});