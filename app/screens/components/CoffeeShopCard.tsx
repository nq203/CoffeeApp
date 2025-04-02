import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  Linking,
} from "react-native";
import { CoffeeShop, RootStackParamList } from "@/app/Types/types";
import {
  MapPinnedIcon,
  BookmarkIcon,
  Navigation
} from "lucide-react-native";
import Swiper from "react-native-swiper";
import * as Location from "expo-location";
import { getDistanceFromUser } from "@/app/utils/distance";
import {
  getFavoriteCafes,
  toggleFavoriteCafe,
} from "@/Firebase/Services/userService";
import { useAuth } from "@/Firebase/Services/authService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
// import MapScreen from "./MapComponent";
const CoffeeShopCard: React.FC<{
  shop: CoffeeShop;
  location: Location.LocationObject | null;
}> = ({ shop, location }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser, loading } = useAuth();
  const [ isOpen, setIsOpen ] = useState<boolean>(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;
      try {
        const favorites = await getFavoriteCafes(currentUser.uid);
        setIsFavorite(favorites.includes(shop.id)); // Cập nhật trạng thái yêu thích
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quán yêu thích:", error);
      }
    };
    fetchFavorites();
  }, [currentUser, shop.id]);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (currentUser) toggleFavoriteCafe(currentUser.uid, shop.id);
  };
  const openGoogleMaps = () => {
    if (!location) {
      alert("Không thể lấy vị trí của bạn!");
      return;
    }

    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const destination = `${shop.latitude},${shop.longitude}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.openURL(googleMapsUrl);
  };
  return (
    <>
      {/* Clickable Card */}
      <Pressable
        className="bg-white rounded-xl shadow-lg flex-row items-center p-4 w-11/12 mx-auto mt-5 "
        onPress={() => navigation.navigate("CoffeeShop", { shop })}
      >
        {/* Left Image */}
        <Image
          source={{ uri: shop.images[0] }}
          className="w-20 h-20 rounded-lg"
        />

        {/* Right Content */}
        <View className="flex-1 ml-4">
          {/* Name */}
          <Text className="text-lg font-bold">{shop.name}</Text>

          {/* Address */}
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
            {shop.address}
          </Text>

          {/* Distance */}
          {location ? (
            <Text className="text-gray-600 text-sm mt-1">
              Cách bạn •{" "}
              {getDistanceFromUser(
                location.coords.latitude,
                location.coords.longitude,
                shop.latitude,
                shop.longitude
              ).toFixed(1)}{" "}
              Km
            </Text>
          ) : (
            <Text className="text-gray-500 text-sm mt-1">
              Chưa có dữ liệu vị trí
            </Text>
          )}

          {/* Opening Status & Hours */}
          <View className="flex-row items-center mt-1">
            <Text
              className={`${
                isOpen ? "text-green-600" : "text-red-500"
              } font-semibold text-sm`}
            >
              {isOpen ? "Đang mở cửa" : "Đang đóng cửa"}
            </Text>
            <Text className="text-gray-600 text-sm ml-2">
              • {shop.opening_hours} - {shop.closing_hours}
            </Text>
          </View>
        </View>

        {/* Favorite Icon */}
        <Pressable onPress={toggleFavorite}>
          <BookmarkIcon
            size={24}
            color={"#854836"}
            fill={isFavorite ? "#854836" : "none"}
          />
        </Pressable>
      </Pressable>
    </>
  );
};

export default CoffeeShopCard;
