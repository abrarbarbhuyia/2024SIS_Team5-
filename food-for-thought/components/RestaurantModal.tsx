import { Button, Icon, Overlay } from "@rneui/themed";
import { View, Image, Text } from 'react-native';
import * as React from "react";
import { styles, currentFont } from '../styles/app-styles';
import { router } from "expo-router";
import MenuItemBadge from "./MenuItemBadge";
import { getDistance } from "geolib";
import axios from "axios";
import Constants from "expo-constants";
import { Restaurant, Meal } from "@/constants/interfaces"
import { NoteModal } from "@/components/NoteModal"

export type RestaurantModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<Restaurant | undefined>>,
  restaurant: Restaurant,
  userLocation: { latitude: number, longitude: number },
  username: string
};

export type Note = {
  noteId?: string,
  date: string,
  content: string,
  restaurantId: string,
  username: string,
  rating: number,
}

const getNextOpening = (openingHours: { close: string, day: number, open: string }[], currentDay: number) => {
  const sortedOpeningHours = openingHours.sort((a, b) => a.day - b.day);

  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7 + 1;
    const nextOpening = sortedOpeningHours.find(hours => hours.day === nextDay);
    if (nextOpening) {
      return { day: nextOpening.day, open: nextOpening.open };
    }
  }

  return null;
};

export function getRestaurantPhoto(restaurantPhotos?: string[], foodPhotos?: string[]) {
  const pic = require('../assets/images/react-logo.png'); // placeholder restaurant image
  return (foodPhotos && foodPhotos.length > 0) ? foodPhotos[0]
    : (restaurantPhotos && restaurantPhotos.length > 0) ? restaurantPhotos[0] : pic;
}

const renderStars = (rating: number) => {
  const stars = Math.round(rating / 2); // get rating between 0 and 5
  return (
    <View style={{ ...styles.starContainer, marginVertical: 0 }}>
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

export const isRestaurantOpen = (openingHours: { close: string, day: number, open: string }[]) => {
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // 1 for monday, 7 for sunday
  const currentTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`; // e.g. convert 10:00AM to '1000'
  const todaysHours = openingHours.filter(hours => hours.day === currentDay);

  // check if the restaurant is currently open or will open later today
  for (const period of todaysHours) {
    const { open, close } = period;
    if (currentTime >= open && currentTime <= close) {
      return { isOpen: true, nextOpen: null };
    }
    if (currentTime < open) {
      return { isOpen: false, nextOpen: { day: currentDay, open } };
    }
  }

  // restaurant is closed for today, find next available opening
  return { isOpen: false, nextOpen: getNextOpening(openingHours, currentDay) };
};


const getDayName = (dayNumber: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber % 7];
};

const formatTime = (time: string) => {
  const hours = parseInt(time.substring(0, 2), 10);
  const minutes = time.substring(2);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes} ${suffix}`;
};

export function RestaurantModal({ restaurant, userLocation, username, setShowModal, ...rest }: RestaurantModalProps) {
  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;
  const [meals, setMeals] = React.useState<Meal[]>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [nextOpen, setNextOpen] = React.useState<{ day: number, open: string } | null>(null);
  const [isFavourited, setIsFavourited] = React.useState(false);
  // const [noteModalVisible, setNoteModalVisible] = React.useState<boolean>(false);
  const [activeNote, setActiveNote] = React.useState<
    Note | undefined
  >();
  const [showNoteModal, setShowNoteModal] = React.useState<boolean>(false);

  const fetchFavouriteStatus = async () => {
    try {
      const response = await axios.get(`http://${HOST_IP}:4000/user/getFavourites/${username}`);
      if (response.data.includes(restaurant.restaurantId)) {
        setIsFavourited(true);  // If the restaurant is favorited, set the state to true
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
    }
  };

  const fetchNote = async () => {
    try {
      const response = await axios.get(`http://${HOST_IP}:4000/note/getNotesRestaurant/${username}/${restaurant.restaurantId}`);
      if (response.data.length > 0) {
        setActiveNote(response.data[0]);
      }
      // else {
      //   // Create a temporary new note (not in DB)
      //   console.log("Creating new note")
      //   const newNote: Note = {
      //     noteId: "temp-" + new Date().getTime(),
      //     date: new Date().toISOString(),
      //     restaurantId: restaurant.restaurantId,
      //     username: username
      //   };
      //   setActiveNote(newNote);
      // }
    } catch (error) {
      console.error('Error fetching or creating new note:', error);
    }
  }

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`http://${HOST_IP}:4000/meal/getMealByMenuId/${restaurant.menuId}`);
      setMeals(response.data);

    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    setIsFavourited(!isFavourited);

    try {
      if (!isFavourited) {
        const response = await axios.put(`http://${HOST_IP}:4000/user/addFavourite/${username}/${restaurant.restaurantId}`);
        if (response.status !== 200) {
          console.log("Error adding favourite:", response);
        }
      } else {
        const response = await axios.delete(`http://${HOST_IP}:4000/user/deleteFavourite/${username}/${restaurant.restaurantId}`);
        if (response.status !== 200) {
          console.log("Error deleting favourite:", response);
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  React.useEffect(() => {
    fetchMeals();
  }, []);

  React.useEffect(() => {
    if (restaurant?.openingHours) {
      const { isOpen, nextOpen } = isRestaurantOpen(restaurant.openingHours);
      setIsOpen(isOpen);
      setNextOpen(nextOpen);
    }
  }, [restaurant]);

  React.useEffect(() => {
    fetchFavouriteStatus();
  }, [restaurant]);

  // price rating out of 1: cheap, 2: average, 3: expensive, 4: very expensive 
  const priceMap: { [key: number]: string } = {
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
      return restaurantType[0].toLowerCase().includes('caf') ? 'Cafe' : restaurantType[0];
    }
    return undefined;
  }

  return (
    <>
      {!showNoteModal &&
        <Overlay overlayStyle={styles.mapModal} isVisible={true} onBackdropPress={() => setShowModal(undefined)}>
          <View style={styles.restaurantFormHeader}>
            <View style={styles.flexRowGroup}>
              <View style={{ ...styles.imageContainer, height: 160, width: '90%', marginRight: 0 }}>
                <Image
                  source={{ uri: getRestaurantPhoto(restaurant.restaurantPhotos, restaurant.foodPhotos) }}
                  style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={styles.iconsContainer}>
                <Icon
                  name='x'
                  type='feather'
                  iconStyle={styles.modalIcon}
                  size={22}
                  onPress={() => setShowModal(undefined)} />
                <Icon
                  name={'star'}
                  type='font-awesome'
                  iconStyle={isFavourited ? styles.modalIcon : styles.unfilledStar}
                  size={22}
                  onPress={handleFavoriteToggle} />
                <Icon
                  name='edit'
                  type='feather'
                  iconStyle={styles.modalIcon}
                  size={22}
                  onPress={() => {
                    fetchNote();
                    // setShowModal(undefined);
                    setShowNoteModal(true);
                  }} />
              </View>
            </View>
            {restaurant.name && <View style={styles.formHeaderContainer}>
              <Text numberOfLines={1} style={styles.formHeaderText}>{restaurant.name}</Text>
            </View>}
          </View>
          <View style={styles.verticalFlexFormGroup}>
            <View style={styles.flexFormGroup}>
              <Text style={styles.formDescriptionTextBold}>
                {calculateCategories(restaurant.cuisineType ? restaurant.cuisineType?.map(c => c.cuisineType) : [],
                  restaurant.restaurantType ? restaurant.restaurantType?.map(c => c.restaurantType) : [])} • {priceMap[restaurant?.price ?? 1]} • {calculateRestaurantDistance(userLocation, restaurant.latitude, restaurant.longitude)} km away
              </Text>
            </View>
            <View style={styles.flexFormGroup}>
              {restaurant.rating && <View style={{ ...styles.flexFormGroup, gap: 7 }}>
                {renderStars(restaurant.rating ?? 0)}
                <Text style={{ ...styles.formDescriptionText, flexDirection: 'row', marginTop: 2, marginLeft: -4 }}>
                  ({restaurant.total_ratings})
                </Text>
              </View>}
              <View style={{ marginLeft: 'auto' }}>{restaurant.menuItemMatches && <MenuItemBadge matches={restaurant.menuItemMatches.length} />}</View>
              <View style={{ marginLeft: 'auto' }}>{restaurant.menuItemMatches && <MenuItemBadge matches={restaurant.menuItemMatches.length} />}</View>
            </View>
            {restaurant.menuItemMatches && <View style={styles.flexFormGroup}>
              <Text style={{...styles.formDescriptionText, fontWeight: '500'}}>
                {restaurant.menuItemMatches.length} menu items matches your dietary filters!
              </Text>
            </View>}
            <View style={styles.flexFormGroup}>
              <Icon
                name='map-pin'
                type='feather'
                iconStyle={styles.modalIcon}
                size={16} />
              <Text numberOfLines={1} style={{...styles.formDescriptionText, width: '90%'}}>{restaurant.address}</Text>
            </View>
            <View style={styles.flexFormGroup}>
              <Icon
                name='clock'
                type='feather'
                iconStyle={styles.modalIcon}
                size={16} />
              <View>{isOpen ? <Text style={styles.formDescriptionText}>Open Now</Text> :
                nextOpen ? <Text style={styles.formDescriptionText}>Closed. Next opens at {formatTime(nextOpen.open)} {getDayName(nextOpen.day)}.</Text>
                  : <Text style={styles.formDescriptionText}>Restaurant is closed and no future opening time available.</Text>}
              </View>
            </View>
            <View style={{ paddingBottom: 10, width: '100%' }}>
              <Text style={styles.formDescriptionTextBold}>Matching menu items </Text>
              {restaurant.menuItemMatches && restaurant.menuItemMatches?.length > 0 && <View style={{ paddingTop: 4 }}>
                <Text numberOfLines={2} style={{ fontSize: 14, opacity: 0.8, ...currentFont }}>{restaurant.menuItemMatches.map(meal => meals?.find(m => m.mealId === meal)?.name ?? 'No meal'.toLocaleLowerCase()).join(', ')}</Text></View>}
            </View>
            <Button buttonStyle={{ ...styles.button, paddingHorizontal: 25, marginTop: 0 }} titleStyle={{ ...styles.buttonTitle, fontSize: 12 }} onPress={() => { router.push({ pathname: "/restaurant", params: { restaurant: JSON.stringify(restaurant) } }); setShowModal(undefined); }} title={('view more').toUpperCase()} />
          </View>
        </Overlay>
      }
      {showNoteModal && (<NoteModal
        setShowNoteModal={setShowNoteModal}
        restaurant={restaurant}
        initialNote={activeNote}
        username={username}
      />
      )}
    </>
  );
}
