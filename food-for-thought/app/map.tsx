import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import SearchBar from "@/components/SearchBar";
import MenuItemBadge, {
  handleMenuItemMatches,
} from "@/components/MenuItemBadge";
import { Badge, Card, Icon, Text } from "@rneui/themed";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import { DietaryFilterModal } from "@/components/DietaryFilterModal";
import Header from "@/components/Header";
import { capitaliseFirstLetter, formatTextValue } from "@/utils";
import { RestaurantModal } from "@/components/RestaurantModal";
import { styles } from "../styles/app-styles";
import Constants from "expo-constants";
import { getDistance } from "geolib";
import Layout from "@/components/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface UserPreferences {
  name: string;
  type: string;
}

export type Restaurant = {
  _id: string;
  restaurantId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  openingHours?: [
    {
      close: string;
      day: number;
      open: string;
    }
  ];
  phoneNumber: string;
  website: string;
  cuisineType?: {
    cuisineType: string;
    icon: string;
  }[];
  restaurantType?: {
    restaurantType: string;
    icon: string;
  }[];
  // price rating out of 1: cheap, 2: average, 3: expensive, 4: very expensive
  price: number;
  // rating out of 10
  rating: number;
  total_ratings: number;
  menuId: string;
  restaurantPhotos?: string[];
  foodPhotos?: string[];
  hasMenu: boolean;
  // number of matching menu items to the current dietary filters
  menuItemMatches?: string[];
};

const RestaurantMap = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<
    { type: string; value: string }[]
  >([]);
  const [activeRestaurant, setActiveRestaurant] = useState<
    Restaurant | undefined
  >();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [username, setUsername] = useState<string>();
  const [filterByDietary, setFilterByDietary] = useState<boolean>(false);
  // initial region is hardcoded to UTS Tower
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -33.88336558611229,
    longitude: 151.2009263036271,
  });

  const filterTypes = ["diets", "allergens", "ingredients", "cuisine", "meals"];
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const pic = require("../assets/images/react-logo.png"); // placeholder restaurant image

  const HOST_IP = Constants.expoConfig?.extra?.HOST_IP;

  //Load the filterByDietary toggle value
  const loadSettings = async () => {
    try {
      const storedFilterByDietary = await AsyncStorage.getItem(
        "filterByDietary"
      );
      if (storedFilterByDietary !== null) {
        setFilterByDietary(JSON.parse(storedFilterByDietary));
      }
    } catch (error) {
      console.error("Error loading settings", error);
    }
  };

  const loadUser = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  React.useEffect(() => {
    loadUser();
    loadSettings();
  }, [loadUser]);

  const fetchUserPreferences = async (username: string) => {
    // if a user is logged in AND has filter by dietary preferences toggleOn - we can fetch their filters - otherwise we use state
    /* if they're logged in, grab the preferences associated with this username */
    if (filterByDietary) {
      try {
        await axios
          .get(`http://${HOST_IP}:4000/user/getUserPreference/${username}`)
          .then((response) => {
            /* set the active filters to these preferences */
            if (response.data.length > 0) {
              setActiveFilters(
                response.data.map((p: UserPreferences) => ({
                  type:
                    p.type == "Cuisine"
                      ? formatTextValue(`${p.type}`)
                      : formatTextValue(`${p.type}s`),
                  value: p.name,
                }))
              );
            }
          });
      } catch (error) {
        console.error("Error fetching user preferences", error);
      }
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`http://${HOST_IP}:4000/search`, {
        params: {
          ingredients:
            (activeFilters?.filter((f) => f.type === "ingredients") || []).map(
              (f) => f.value
            ) || [],
          allergens:
            (activeFilters?.filter((f) => f.type === "allergens") || []).map(
              (f) => f.value
            ) || [],
          diets:
            (activeFilters?.filter((f) => f.type === "diets") || []).map(
              (f) => f.value
            ) || [],
          cuisine:
            (activeFilters?.filter((f) => f.type === "cuisine") || []).map(
              (f) => f.value
            ) || [],
          meals:
            (activeFilters?.filter((f) => f.type === "meals") || []).map(
              (f) => f.value
            ) || [],
          searchQuery: searchTerm,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 2000, // hard-coded to 2000m right now, this can change in user settings
        },
      });
      sortRestaurants(response.data);
      bottomSheetModalRef.current?.present();
    } catch (error: any) {
      console.error(
        JSON.stringify(error) || "Error searching restaurants. Try again."
      );
    }
  };

  const sortRestaurants = (restaurants: Restaurant[]) => {
    const sortedList = [...restaurants].sort((a, b) => {
      if (activeFilters.length > 0 && a.menuItemMatches && b.menuItemMatches) { // if a filter has been applied, sort by match quality
        return b.menuItemMatches.length - a.menuItemMatches.length;
      } else {
        const distanceA = calculateRestaurantDistance(userLocation, a.latitude, a.longitude); // sort by distance by default (closest to furthest)
        const distanceB = calculateRestaurantDistance(userLocation, b.latitude, b.longitude);
        return parseFloat(distanceA) - parseFloat(distanceB);
      }
    });
    setRestaurants(sortedList);
  }

  useEffect(() => {
    if (username && filterByDietary) {
      fetchUserPreferences(username);
    }
  }, [filterByDietary]);

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm, activeFilters]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const calculateRestaurantDistance = (
    userLocation: { latitude: number; longitude: number },
    latitude: string,
    longitude: string
  ) => {
    const restaurantLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    const distanceInMeters = getDistance(userLocation, restaurantLocation);
    return (distanceInMeters / 1000).toFixed(2);
  };

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); // get rating between 0 and 5
    return (
      <View style={styles.starContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={index}
            name="star"
            type="font-awesome"
            iconStyle={index < stars ? styles.filledStar : styles.unfilledStar}
            size={22}
          />
        ))}
      </View>
    );
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => {
        router.push({
          pathname: "/restaurant",
          params: { restaurant: JSON.stringify(item) },
        });
      }}
    >
      <View style={styles.restaurantItemContainer}>
        <Image
          source={
            item.restaurantPhotos && item.restaurantPhotos.length > 0
              ? { uri: item.restaurantPhotos[0] }
              : pic
          }
          style={styles.bottomSheetImage}
        />
        <View style={styles.restaurantTextContainer}>
          <Text style={styles.formHeaderText} numberOfLines={1}>
            {item.name || "Restaurant Title"}
          </Text>
          <View style={styles.restaurantDetailsContainer}>
            {item.menuItemMatches && <MenuItemBadge matches={item.menuItemMatches.length} />}
            {renderStars(item.rating)}
            <Text style={{ ...styles.formDescriptionText, marginLeft: -7 }}>
              ({item.total_ratings})
            </Text>
          </View>
          <Text style={styles.formDescriptionText}>
            {item.cuisineType && item.cuisineType.length > 0
              ? item.cuisineType
                  .map((cuisineObj: any) =>
                    capitaliseFirstLetter(cuisineObj.cuisineType)
                  )
                  .join(", ")
              : "Other"}{" "}
            • {"$".repeat(item.price)} •{" "}
            {calculateRestaurantDistance(
              userLocation,
              item.latitude,
              item.longitude
            )}{" "}
            km away
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const markerColor: { [key: string]: string } = {
    MEH: "#EA4335",
    OKAY: "#F2B90F",
    PERFECT: "#16CA94",
  };

  return (
    <Layout>
      <BottomSheetModalProvider>
        <Card containerStyle={styles.mapDisplayCard}>
          <View style={{ flexDirection: "column", rowGap: 2 }}>
            <SearchBar onSearch={handleSearch} />
            <View style={styles.flexContainer}>
              <Icon
                name="sliders"
                type="font-awesome"
                iconStyle={styles.mapIcon}
                size={20}
              />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgeScrollView}
              >
                {activeFilters.length > 0 ? (
                  activeFilters.map((f) => (
                    <Badge
                      badgeStyle={{
                        ...styles.filterBackground,
                        backgroundColor: filterColours[f.type]?.fill ?? "white",
                        borderColor: filterColours[f.type]?.border ?? "white",
                      }}
                      textStyle={styles.filterText}
                      key={`${f.type}-${f.value}`}
                      value={
                        <Text style={styles.filterText}>
                          {`${
                            f.type === "allergens" ? "No" : ""
                          } ${capitaliseFirstLetter(f.value)}`}
                          <Icon
                            name="x"
                            type="feather"
                            iconStyle={styles.badgesCross}
                            size={15}
                            onPress={() =>
                              activeFilters.length > 0
                                ? setActiveFilters(
                                    activeFilters.filter(
                                      (filter) => !(filter === f)
                                    )
                                  )
                                : null
                            }
                          />
                        </Text>
                      }
                    />
                  ))
                ) : (
                  <Text style={{ color: "grey", fontSize: 12, paddingTop: 5 }}>
                    No filters set
                  </Text>
                )}
              </ScrollView>
            </View>
            <View
              style={{
                ...styles.flexContainer,
                paddingBottom: 6,
                overflow: "scroll",
              }}
            >
              {filterTypes.map((f) => (
                <Badge
                  containerStyle={{ flex: 1 }}
                  badgeStyle={{
                    ...styles.typesBackground,
                    width: "100%",
                    ...((filterType === f ||
                      activeFilters.map((f) => f.type).includes(f)) && {
                      backgroundColor: filterColours["selected"].fill,
                      borderColor: filterColours["selected"].border,
                    }),
                  }}
                  value={
                    <View style={styles.filterBadgeContainer}>
                      {activeFilters.map((f) => f.type).includes(f) && (
                        <Icon
                          name="check"
                          type="feather"
                          iconStyle={styles.filterCheck}
                          size={13}
                        />
                      )}
                      <Text style={styles.typesText}>
                        {capitaliseFirstLetter(f)}
                      </Text>
                    </View>
                  }
                  key={f}
                  onPress={() => setFilterType(f)}
                />
              ))}
            </View>
            <MapView
              style={styles.mapDisplay}
              initialRegion={{
                ...userLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={userLocation} title={"My location"}>
                <View style={styles.filledCircle} />
              </Marker>
              {restaurants.length > 0 &&
                restaurants.map((r, i) => (
                  <Marker
                    key={`marker-${i}`}
                    coordinate={{
                      latitude: parseFloat(r.latitude),
                      longitude: parseFloat(r.longitude),
                    }}
                    onPress={() => setActiveRestaurant(r)}
                  >
                    <View style={styles.markerContainer}>
                      <Icon
                        name="fmd-good"
                        type="material"
                        color={
                          r.menuItemMatches
                            ? markerColor[
                                handleMenuItemMatches(r.menuItemMatches.length)
                              ]
                            : "#EA4335"
                        }
                        size={50}
                      />
                      <View
                        style={{
                          ...styles.innerCircle,
                          backgroundColor: r.menuItemMatches
                            ? markerColor[
                                handleMenuItemMatches(r.menuItemMatches.length)
                              ]
                            : "#EA4335",
                        }}
                      >
                        {r.cuisineType && r.cuisineType.length > 0 ? (
                          <Image
                            source={{
                              uri: r.cuisineType[r.cuisineType.length - 1].icon,
                            }}
                            style={styles.markerIcon}
                          />
                        ) : r.restaurantType && r.restaurantType.length > 0 ? (
                          <Image
                            source={{
                              uri: r.restaurantType[r.restaurantType.length - 1]
                                .icon,
                            }}
                            style={styles.markerIcon}
                          />
                        ) : (
                          <Image
                            source={{
                              uri: "https://ss3.4sqi.net/img/categories_v2/food/default_64.png",
                            }}
                            style={styles.markerIcon}
                          />
                        )}
                      </View>
                    </View>
                  </Marker>
                ))}
            </MapView>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetView>
                {restaurants.length > 0 ? (
                  <FlatList
                    data={restaurants}
                    renderItem={renderRestaurant}
                    keyExtractor={(item) => item.restaurantId}
                  />
                ) : (
                  <Text style={styles.noResultsText}>
                    No restaurants found.
                  </Text>
                )}
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </Card>
        {filterType && (
          <DietaryFilterModal
            filterType={filterType}
            currentFilters={activeFilters}
            setShowModal={setFilterType}
            setActiveFilters={setActiveFilters}
          />
        )}
        {activeRestaurant && (
          <RestaurantModal
            setShowModal={setActiveRestaurant}
            userLocation={userLocation}
            restaurant={activeRestaurant}
          />
        )}
      </BottomSheetModalProvider>
    </Layout>
  );
};

const filterColours: { [key: string]: { fill: string; border: string } } = {
  diets: { fill: "#F3D9FF", border: "#D59CEF" },
  allergens: { fill: "#FFDCDC", border: "#FEACAC" },
  ingredients: { fill: "#E4EDFF", border: "#A8C1F3" },
  cuisine: { fill: "#FFF2D9", border: "#FFC56F" },
  meals: { fill: "#DDF8DD", border: "#B5EFB5" },
  selected: { fill: "#E8DEF8", border: "#BDB0CA" },
};

export default RestaurantMap;
