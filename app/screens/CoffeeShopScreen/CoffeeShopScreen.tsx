import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { CoffeeShop, Review } from "@/app/Types/types";
import Swiper from "react-native-swiper";
import { MapPin, Navigation, Star } from "lucide-react-native";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { getDistanceFromUser } from "@/app/utils/distance";
import {
  addReview,
  getReviewsByShopId,
} from "@/Firebase/Services/reviewService";

type RatingCriteria = {
  label: string;
  value: number;
  setValue: (value: number) => void;
};

export default function CoffeeShopScreen() {
  const route = useRoute();
  const { shop }: { shop: CoffeeShop } = route.params as { shop: CoffeeShop };
  const {user} = useSelector((state : RootState) => state.user);
  const { location } = useSelector((state: RootState) => state.location);
  const [comment, setComment] = useState<string>("");
  const [ratingSpace, setRatingSpace] = useState(5);
  const [ratingService, setRatingService] = useState(5);
  const [ratingDrinks, setRatingDrinks] = useState(5);
  const [ratingPrice, setRatingPrice] = useState(5);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const ratingCriteria: RatingCriteria[] = [
    { label: "Không gian", value: ratingSpace, setValue: setRatingSpace },
    { label: "Dịch vụ", value: ratingService, setValue: setRatingService },
    { label: "Đồ uống", value: ratingDrinks, setValue: setRatingDrinks },
    { label: "Giá cả", value: ratingPrice, setValue: setRatingPrice },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByShopId(shop.id);
        setReviews(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shop.id]);

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

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating_drinks, 0) /
          reviews.length
        ).toFixed(1)
      : "Chưa có";

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đánh giá!");
      return;
    }

    const newReview: Review = {
      id: "",
      user: user?.name || "Khách hàng ẩn danh",
      shopId: shop.id,
      rating_space: ratingSpace,
      rating_service: ratingService,
      rating_drinks: ratingDrinks,
      rating_price: ratingPrice,
      comment,
      images: [],
      created_at: new Date().toISOString(),
    };

    try {
      await addReview(shop.id, newReview);
      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
      setComment("");
      setRatingSpace(5);
      setRatingService(5);
      setRatingDrinks(5);
      setRatingPrice(5);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi đánh giá!");
    }
  };

  const getEmojiForRating = (rating: number) => {
    switch (rating) {
      case 5: return "😍";
      case 4: return "😊";
      case 3: return "😐";
      case 2: return "😕";
      case 1: return "😢";
      default: return "😊";
    }
  };

  return (
    <ScrollView className="bg-white flex-1">
      <Swiper
        showsPagination={true}
        activeDotColor={"#854836"}
        className="w-full h-64"
      >
        {shop.images.map((image, index) => (
          <View key={index} className="w-full h-64">
            <Image source={{ uri: image }} className="w-full h-64" />
          </View>
        ))}
      </Swiper>

      <View className="p-5">
        <Text className="text-2xl font-bold">{shop.name}</Text>
        <Text className="text-gray-600">{shop.address}</Text>

        <View className="flex-row items-center mt-2">
          <MapPin size={18} color="#6b7280" />
          {location ? (
            <Text className="text-gray-600 mt-2">
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
        </View>

        <Pressable
          className="bg-[#854836] p-2 mt-3 rounded-lg flex-row items-center"
          onPress={openGoogleMaps}
        >
          <Navigation size={18} color="#fff" />
          <Text className="text-white text-center ml-2">Đi thôi</Text>
        </Pressable>

        <View className="items-center mb-4">
          <Text className="text-lg font-semibold">
            ⭐ Điểm trung bình: {averageRating} / 5
          </Text>
          <Text className="text-gray-500">{reviews.length} đánh giá</Text>
        </View>

        {/* Danh sách đánh giá */}
        <Text className="text-lg font-semibold mb-2">
          Đánh giá từ khách hàng:
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#854836" />
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <Text className="font-bold">{review.user}</Text>
              <Text className="text-gray-700">{review.comment}</Text>
              <View className="flex-row mt-2">
                <Text className="text-yellow-500 mr-2">
                  ⭐ {review.rating_drinks}/5
                </Text>
                <Text className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">Chưa có đánh giá nào.</Text>
        )}

        {/* Form thêm đánh giá */}
        <View className="mt-8">
          <Text className="text-xl font-bold mb-4 text-[#854836]">
            Chia sẻ trải nghiệm của bạn
          </Text>

          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Rating Criteria */}
            <View className="p-4">
              {ratingCriteria.map((criteria) => (
                <View key={criteria.label} className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    {criteria.label}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Pressable
                          key={value}
                          onPress={() => criteria.setValue(value)}
                          className={`w-12 h-12 rounded-full items-center justify-center ${
                            value === criteria.value
                              ? "bg-[#854836]"
                              : "bg-gray-100"
                          }`}
                        >
                          <Text className={`text-xl ${
                            value === criteria.value ? "text-white" : "text-gray-400"
                          }`}>
                            {value}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-[#854836] font-bold mr-2">
                        {criteria.value}/5
                      </Text>
                      <Text className="text-gray-500">
                        {getEmojiForRating(criteria.value)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Comment Section */}
            <View className="p-4 bg-gray-50">
              <Text className="font-semibold text-gray-800 mb-2">
                Chia sẻ chi tiết
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 text-base min-h-[120px]"
                placeholder="Kể về trải nghiệm của bạn tại quán..."
                value={comment}
                onChangeText={setComment}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <Pressable
              className="bg-[#854836] p-4 mx-4 my-4 rounded-xl flex-row items-center justify-center"
              onPress={handleSubmitReview}
            >
              <Text className="text-white text-center text-lg font-semibold mr-2">
                Gửi đánh giá
              </Text>
              <Text className="text-white text-xl">
                {getEmojiForRating(ratingDrinks)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
