import { Button, Icon, Overlay, Divider, Badge } from "@rneui/themed";
import { View, Image, Text } from 'react-native';
import * as React from "react";
import pic from '../assets/images/react-logo.png'; // Placeholder image
import { Restaurant } from "@/app/map";
import { styles } from '../styles/app-styles';
import { router } from "expo-router";
import MenuItemBadge from "./MenuItemBadge";
import { getDistance } from "geolib";
import axios from "axios";
import Constants from "expo-constants";

export type RestaurantModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<Restaurant | undefined>>,
  restaurant: Restaurant,
  userLocation: { latitude: number, longitude: number }
};

export type Meal = {
  _id: string,
  mealId: string,
  name: string,
  diet: string[],
  menuId: string
}

export function getRestaurantPhoto(restaurantPhotos?: string[], foodPhotos?: string[]){
  return (foodPhotos && foodPhotos.length > 0) ? foodPhotos[0] 
    : (restaurantPhotos && restaurantPhotos.length > 0) ? restaurantPhotos[0] : pic;
}

const renderStars = (rating: number) => {
  const stars = Math.round(rating / 2); // get rating between 0 and 5
  return (
    <View style={{...styles.starContainer, marginVertical: 0}}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          name='star'
          type='font-awesome'
          iconStyle={index < stars ? styles.filledStar : styles.unfilledStar}
          size={22}
        />
      ))}
    </View>
  );
};

export function RestaurantModal({ restaurant, userLocation, setShowModal, ...rest }: RestaurantModalProps) {
  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
  const [meals, setMeals] = React.useState<Meal[]>();

  const fetchMeals = async () => {
    try {
        const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${restaurant.menuId}`);
        setMeals(response.data);

    } catch (error) {
        console.error("Error fetching meals:", error);
    }
  };

  React.useEffect(() => {
    fetchMeals();
  }, []);


  // price rating out of 1: cheap, 2: average, 3: expensive, 4: very expensive 
  const priceMap: {[key: number]: string} = {
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$'
  }

  const calculateRestaurantDistance = (userLocation: { latitude: number, longitude: number }, latitude: string, longitude: string) => {
    const restaurantLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const distanceInMeters = getDistance(userLocation, restaurantLocation);
    return (distanceInMeters / 1000).toFixed(2);
  }

  const calculateCategories = (cuisineType?: string[], restaurantType?: string[]) => {
    if (cuisineType && cuisineType.length > 0) {
      return cuisineType.join(', ');
    }
    if (restaurantType && restaurantType.length > 0) {
      return restaurantType[0].toLowerCase().includes('caf') ? 'Café' : restaurantType[0];
    }
    return undefined;
  }

  return <Overlay overlayStyle={styles.modal} isVisible={true} onBackdropPress={() => setShowModal(undefined)}>
    <View style={styles.restaurantFormHeader}>
      <View style={styles.flexRowGroup}>
        <View style={{...styles.imageContainer, height: 160, width: '90%', marginRight: 0 }}>
          <Image 
            source={{ uri: getRestaurantPhoto(restaurant.restaurantPhotos, restaurant.foodPhotos)}} 
            style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={styles.iconsContainer}>
          <Icon
            name='x'
            type='feather'
            iconStyle={styles.modalIcon}
            size={22} 
            onPress={() => setShowModal(undefined)}/>
          <Icon
            name='star'
            type='feather'
            iconStyle={styles.modalIcon}
            size={22} />
          <Icon
            name='edit'
            type='feather'
            iconStyle={styles.modalIcon}
            size={22} />
        </View>
      </View>
      {restaurant.name && <View style={styles.formHeaderContainer}>
        <Text style={styles.formHeaderText}>{restaurant.name}</Text>
      </View>}
    </View>
    <View style={styles.verticalFlexFormGroup}>
      <View style={styles.flexFormGroup}>
        {restaurant.rating && <View style={{...styles.flexFormGroup, gap: 7 }}>
          <Text style={{...styles.formDescriptionTextBold, flexDirection: 'row'}}>
            {Math.round(restaurant.rating/2)}/5
          </Text>
          {renderStars(restaurant.rating ?? 0)}
          <Text style={{...styles.formDescriptionText, flexDirection: 'row', marginLeft: -4 }}>
            ({restaurant.total_ratings})
          </Text>
        </View>}
        <View style={{marginLeft: 'auto'}}>{restaurant.menuItemMatches && <MenuItemBadge matches={restaurant.menuItemMatches} />}</View>
      </View>
      <View style={styles.flexFormGroup}>
        <Text style={styles.formDescriptionTextBold}>
          {calculateCategories(restaurant.cuisineType? restaurant.cuisineType?.map(c => c.cuisineType) : [],
            restaurant.restaurantType ? restaurant.restaurantType?.map(c => c.restaurantType) : [])} • {priceMap[restaurant?.price ?? 1]} • {calculateRestaurantDistance(userLocation, restaurant.latitude, restaurant.longitude)} km away
        </Text>
      </View>
      {restaurant.menuItemMatches && <View style={styles.flexFormGroup}>
         <Text style={styles.formDescriptionText}>
          {restaurant.menuItemMatches} menu items matches your dietary filters!
        </Text>
      </View>}
      <View style={styles.flexFormGroup}>
        <Icon
          name='map-pin'
          type='feather'
          iconStyle={styles.modalIcon}
          size={16} />
        <Text style={styles.formDescriptionText}>{restaurant.address}</Text>
      </View>
      <View style={styles.flexFormGroup}>
        <Icon
          name='clock'
          type='feather'
          iconStyle={styles.modalIcon}
          size={16} />
        <Text style={styles.formDescriptionText}>{restaurant.name}</Text>
      </View>
      <View style={{paddingBottom: 10}}>
        <Text style={styles.formDescriptionTextBold}>Matching menu items </Text>
        {meals && <View style={{paddingTop: 4}}>
          <Text numberOfLines={2} style={{fontSize: 14, opacity: 0.8}}>{meals.length > 0 ? meals.map(meal => meal.name.toLocaleLowerCase()).join(', ') : '<menu item>'}.</Text></View>}
      </View>
      <Button buttonStyle={{...styles.button, paddingHorizontal: 25, marginTop: 0}} titleStyle={{...styles.buttonTitle, fontSize: 12}} onPress={() => {router.push('/restaurant'); setShowModal(undefined);}} title={('view more').toUpperCase()} />
    </View>
  </Overlay>
}
