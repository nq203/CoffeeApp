import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { ForumPost } from "@/app/Types/types";
import { getAllForumPosts } from "@/Firebase/Services/forumService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/Types/types";
import PostCard from "./components/PostCard";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

type ForumScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

const ForumScreen = () => {
  const navigation = useNavigation<ForumScreenNavigationProp>();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const fetchPosts = async () => {
    const data = await getAllForumPosts();
    setPosts(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    navigation.navigate("CreateForumPost");
  };

  const renderItem = ({ item }: { item: ForumPost }) => (
    <PostCard
      post={item}
      onPress={() => {
        navigation.navigate("Post", { post: item });
      }}
    />
  );
  return (
    <View className="flex-1 bg-[#F6F1ED]">
      {/* Header */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm flex-row items-center">
        <Image
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require("@/assets/images/default-avatar.jpg")
          }
          className="w-10 h-10 rounded-full mr-3"
        />
        <TouchableOpacity
          onPress={handleCreatePost}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2"
        >
          <Text className="text-gray-500">Bạn đang nghĩ gì?</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerClassName=" pb-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchPosts();
                setRefreshing(false);
              }}
            />
          }
          ListHeaderComponent={<View className="mb-2" />}
        />
      )}
    </View>
  );
};

export default ForumScreen;
