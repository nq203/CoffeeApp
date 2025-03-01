export type RootStackParamList = {
  Tabs: undefined;
  Login: { itemId: number; otherParam?: string };
  Register: {itemId: number, otherParam?: string};
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Forum: undefined;
};
export interface CoffeeShop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  closing_hours: string;
  images: string[];
  amenities: string[];
  reviews: string[];
  created_at: string;
  updated_at: string;
};
export interface Review {
  id: string;
  user: string;
  rating_space: number;
  rating_service: number;
  rating_drinks: number;
  rating_price: number;
  comment: string;
  images: string[];
  created_at: string;
};
export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  favorites: string[];
  favorite_cafes: string[];
  created_at: string;
  updated_at: string;
};

export interface ForumPost {
  id: string;
  content: string;
  comments: string[];
  images: string[];
  created_at: string;
}
export interface Comment {
  id: string;
  user: string;
  content: string;
  created_at: string;
}
export interface FavoriteCofe {
};