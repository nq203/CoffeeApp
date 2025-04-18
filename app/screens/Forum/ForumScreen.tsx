import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ForumPost } from "@/app/Types/types";
import { getAllForumPosts } from "@/Firebase/Services/forumService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/Types/types";
import PostCard from "./components/PostCard";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

type ForumScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

const ForumScreen = () => {
  const navigation = useNavigation<ForumScreenNavigationProp>();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      <View className="flex-row justify-between items-center px-4 py-4">
        <Text className="text-2xl font-bold">Tương tác cộng đồng</Text>
        <TouchableOpacity className="p-2" onPress={handleCreatePost}>
          <Ionicons name="add-circle" size={30} color="#854836" />
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
          contentContainerClassName="px-4 pb-4"
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
