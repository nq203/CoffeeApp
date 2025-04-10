export type RootStackParamList = {
  Tabs: undefined;
  CoffeeShop: { shop: CoffeeShop };
  Login: { itemId: number; otherParam?: string };
  Register: {itemId: number, otherParam?: string};
  CreateForumPost: undefined;
  Post: { post: ForumPost };
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
  utilities: number[];
  created_at: string;
  updated_at: string;
};
export interface GroupOfCoffeeShop {
  id: string;
  title: string;
  images: string[];
  coffeeshop_ids: string[];
};
export interface Review {
  id: string;
  user: string;
  shopId: string;
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
  name: string;
  email: string;
  photoURL: string;
  favorites: string[];
  favorite_cafes: string[];
  created_at: string;
  updated_at: string;
};

export interface ForumPost {
  id: string;
  user: string;
  content: string;
  images: string[];
  liked: string[];
  comment: string[];
  created_at: string;
}
export interface Comment {
  id: string;
  user: string;
  liked: string[];
  content: string;
  created_at: string;
}
export interface Utilities {
  id: string;
  code: number;
  name: string;
}