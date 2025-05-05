import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoffeeShop, ForumPost, User } from "@/app/Types/types";
import { getUser } from "@/Firebase/Services/userService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/Types/types";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { TextInput } from "react-native";
import {
  getFavoriteUserPost,
  toggleFavoritePost,
} from "@/Firebase/Services/forumService";
import { getCoffeeShopById } from "@/Firebase/Services/coffeeShopService";

type PostCardNavigationProp = StackNavigationProp<RootStackParamList, "Post">;

interface PostProps {
  post: ForumPost;
  onPress?: () => void;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const navigation = useNavigation<PostCardNavigationProp>();
  const [postUser, setPostUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [coffeeShop, setCoffeeShop] = useState<CoffeeShop | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchPostUser = async () => {
      console.log("id user: ", post.user);
      const user = await getUser(post.user);
      console.log("infor user: ", user);
      setPostUser(user);
    };
    fetchPostUser();
    fetchFavorites();
    fetchCafeTag();
  }, []);
  const fetchCafeTag = async () => {
    if (post.cafeId) {
      const data = await getCoffeeShopById(post.cafeId);
      setCoffeeShop(data);
    }
  };
  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const favorites = await getFavoriteUserPost(post.id);
      console.log("Da tim bai viet: ", favorites, " user id: ", user.id);
      setIsFavorite(favorites.includes(user.id)); // Cập nhật trạng thái yêu thích
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quán yêu thích:", error);
    }
  };
  const handlePress = () => {
    navigation.navigate("Post", { post });
  };
  const handleToggleFavorite = async () => {
    if (!user) return;
    try {
      await toggleFavoritePost(post.id, user.id, isFavorite);
      setIsFavorite(!isFavorite); // Optimistic UI update
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm"
      onPress={handlePress}
    >
      {/* Header */}
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={
            postUser?.photoURL
              ? { uri: postUser.photoURL }
              : require("@/assets/images/default-avatar.jpg")
          }
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold text-base">{postUser?.name}</Text>
          <Text className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleString()}
          </Text>

          {/* Nếu có quán cafe thì hiện tại đây */}
          {coffeeShop && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="cafe-outline" size={14} color="#854836" />
              <Text className="ml-1 text-xs text-[#854836]">
                Đang ở <Text className="font-semibold">{coffeeShop.name}</Text>
              </Text>
            </View>
          )}
        </View>
      </View>
      {/* Content */}
      <Text className="text-gray-800 text-base mb-3" numberOfLines={3}>
        {post.content}
      </Text>

      {/* Images */}
      {post.images?.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {post.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              className={`rounded-lg ${
                post.images.length === 1 ? "w-full h-48" : "w-[48%] h-40"
              }`}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Footer */}
      {/* Footer */}
      <View className="flex-row items-center border-t border-gray-200 pt-2">
        <Image
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require("@/assets/images/default-avatar.jpg")
          }
          className="w-8 h-8 rounded-full mr-2"
        />
        <View className="flex-1 bg-gray-100 rounded-full px-3 py-1 mr-2">
          <Text className="text-gray-500 text-sm">Send message...</Text>
        </View>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className="flex-row items-center"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#854836" : "#666"}
          />
          <Text className="ml-1 text-sm text-gray-600">
            {post.liked?.length || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
