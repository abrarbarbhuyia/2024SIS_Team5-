export interface Ingredient {
  ingredientId: string;
  name: string;
  allergens: string[];
}

export interface Meal {
  mealId: string;
  name: string;
  diet?: string[];
  menuId?: string;
}

export interface MealIngredient {
  mealId: string;
  ingredientId: string;
}

export interface Menu {
  menuId: string;
  restaurantId: string;
  menuString: string;
}

export interface openingHours {
  close: string;
  day: number;
  open: string;
};

export interface cuisineType {
  cuisineType: string;
  icon: string;
};

export interface Restaurant {
  restaurantId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  openingHours?: openingHours[];
  phoneNumber: string;
  website: string;
  cuisineType?: cuisineType[];
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
  menuItemMatches?: number;
}

export interface UserPreferences {
  name: string;
  type: string;
};

export interface User {
  username: string;
  password: string;
  favourites: string[];
  preferences: UserPreferences[];
}
