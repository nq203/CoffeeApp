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
import { CoffeeShop } from "@/app/Types/types";
import {
  MapPin,
  Clock,
  Star,
  MapPinnedIcon,
  BookmarkIcon,
  Navigation,
} from "lucide-react-native";
import Swiper from "react-native-swiper";
import * as Location from "expo-location";
import { getDistanceFromUser } from "@/app/utils/distance";
import {
  getFavoriteCafes,
  toggleFavoriteCafe,
} from "@/Firebase/Services/userService";
import { useAuth } from "@/Firebase/Services/authService";
// import MapScreen from "./MapComponent";
const CoffeeShopCard: React.FC<{
  shop: CoffeeShop;
  location: Location.LocationObject | null;
}> = ({ shop, location }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser, loading } = useAuth();

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
        className="bg-white rounded-xl shadow-lg p-4 w-11/12 mx-auto mt-5"
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: shop.images[0] }}
          className="w-full h-48 rounded-lg"
        />
        <Text className="text-xl font-bold mt-3">{shop.name}</Text>

        {/* Address */}
        <View className="flex-row items-center mt-1">
          <MapPin size={18} color="#6b7280" />
          <Text className="text-gray-600 ml-2">{shop.address}</Text>
        </View>
        {location ? (
          <View className="flex-row items-center mt-1">
            <MapPinnedIcon size={18} color="#6b7280" />
            <Text className="text-gray-600 ml-2">
              {getDistanceFromUser(
                location.coords.latitude,
                location.coords.longitude,
                shop.latitude,
                shop.longitude
              ).toFixed(1)}{" "}
              Km
            </Text>
          </View>
        ) : (
          <Text className="text-gray-500 ml-2">Chưa có dữ liệu vị trí</Text>
        )}
        {/* Opening Hours */}
        <View className="flex-row items-center mt-1">
          <Clock size={18} color="#6b7280" />
          <Text className="text-gray-600 ml-2">
            {shop.opening_hours} - {shop.closing_hours}
          </Text>
        </View>

        {/* Ratings */}
        {shop.reviews && shop.reviews.length > 0 ? (
          <View className="flex-row items-center mt-3">
            <Star size={18} color="gold" />
            <Text className="text-gray-800 ml-2 font-semibold">
              {(
                shop.reviews.reduce(
                  (acc, review) => acc + review.rating_drinks,
                  0
                ) / shop.reviews.length
              ).toFixed(1)}{" "}
              / 5
            </Text>
          </View>
        ) : (
          <Text className="text-gray-500 mt-3">Chưa có đánh giá</Text>
        )}

        <Pressable
          className="absolute bottom-4 right-4 bg-white p-3 shadow-lg"
          onPress={toggleFavorite}
        >
          <BookmarkIcon
            size={24}
            color={"#854836"}
            fill={isFavorite ? "#854836" : "none"}
          />
        </Pressable>
      </Pressable>

      {/* Modal for Full Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Pressable to Detect Taps Outside */}
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setModalVisible(false)} // Close modal on tap outside
        >
          <View
            className="bg-white rounded-lg w-11/12 p-5 shadow-lg"
            onStartShouldSetResponder={() => true}
          >
            {/* Modal Content */}
            <ScrollView>
              <Swiper
                showsPagination={true}
                activeDotColor={"#854836"}
                className="w-full h-[250px]"
              >
                {shop.images.map((image, index) => (
                  <View key={index} className="rounded-lg overflow-hidden">
                    <Image
                      source={
                        typeof image === "string" ? { uri: image } : image
                      }
                      className="w-full h-[200px]"
                    />
                  </View>
                ))}
              </Swiper>

              <Text className="text-2xl font-bold mt-3">{shop.name}</Text>
              <Text className="text-gray-600 mt-1">{shop.address}</Text>

              {/* Opening Hours */}
              <Text className="text-gray-700 mt-2">
                🕒 {shop.opening_hours} - {shop.closing_hours}
              </Text>
              {location ? (
                <View className="flex-row items-center justify-between mt-1">
                {/* Icon + Distance Group */}
                <View className="flex-row items-center">
                  <MapPinnedIcon size={18} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {getDistanceFromUser(
                      location.coords.latitude,
                      location.coords.longitude,
                      shop.latitude,
                      shop.longitude
                    ).toFixed(1)}{" "}
                    Km
                  </Text>
                </View>
              
                {/* Navigation Button */}
                <Pressable className="bg-[#854836] ml-auto rounded-lg" onPress={openGoogleMaps}>
                  <View className="flex-row items-center p-1">
                    <Navigation size={18} color="#fff" />
                    <Text className="text-white text-center ml-1">Đi thôi</Text>
                  </View>
                </Pressable>
              </View>
              
              ) : (
                <Text className="text-gray-500 ml-2">
                  Chưa có dữ liệu vị trí
                </Text>
              )}

              {/* Amenities */}
              <Text className="font-semibold mt-3">Amenities:</Text>
              <View className="flex-row flex-wrap mt-1">
                {shop.amenities.map((amenity, index) => (
                  <Text
                    key={index}
                    className="text-gray-700 bg-gray-200 px-2 py-1 rounded-lg mr-2 mt-1"
                  >
                    {amenity}
                  </Text>
                ))}
              </View>

              {/* Reviews */}
              <Text className="font-semibold mt-3">Reviews:</Text>
              {shop.reviews && shop.reviews.length > 0 ? (
                shop.reviews.map((review, index) => (
                  <View key={index} className="bg-gray-100 p-3 rounded-lg mt-2">
                    <Text className="font-bold">{review.user.username}</Text>
                    <Text className="text-gray-700">{review.comment}</Text>
                    <Text className="text-yellow-500 mt-1">
                      ⭐ {review.rating_drinks}/5
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500 mt-2">No reviews yet.</Text>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CoffeeShopCard;
