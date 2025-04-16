import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import {
  ForumPost,
  Comment,
  RootStackParamList,
  User,
} from "@/app/Types/types";
import {
  addComment,
  getCommentsByPostId,
} from "@/Firebase/Services/commentService";
import { getUser } from "@/Firebase/Services/userService";
import { auth } from "@/Firebase/firebaseConfig";

type PostScreenRouteProp = RouteProp<RootStackParamList, "Post">;

const PostScreen = () => {
  const route = useRoute<PostScreenRouteProp>();
  const navigation = useNavigation();
  const { post } = route.params;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentUsers, setCommentUsers] = useState<{ [uid: string]: User }>({});
  const [postUser, setPostUser] = useState<User | null>(null);

  const fetchComments = async () => {
    const data = await getCommentsByPostId(post.id);
    console.log("comment", data);
    setComments(data);

    const uniqueUserIds = [...new Set(data.map((c) => c.user))];
    const userMap: { [uid: string]: User } = {};
    for (const uid of uniqueUserIds) {
      const data = await getUser(uid);
      if (data) {
        userMap[uid] = data; // ✅ gán đúng
      }
    }

    setCommentUsers(userMap);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User must be authenticated");

      const commentData: Omit<Comment, "id"> = {
        content: comment.trim(),
        post_id: post.id,
        user: currentUser.uid,
        liked: [],
        created_at: new Date().toISOString(),
      };

      await addComment(commentData);
      setComment("");
      // fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  useEffect(() => {
    const fetchPostUser = async () => {
      const user = await getUser(post.user);
      setPostUser(user);
    };
    fetchComments();
    fetchPostUser();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-2">Post Details</Text>
      </View>

      {/* Nội dung */}
      <ScrollView className="flex-1 px-4 py-3">
        {/* Post Info */}
        <View className="bg-white p-4 rounded-lg mb-4">
          {/* Header */}
          <View className="flex-row items-center mb-3">
            <Image
              source={{
                uri: postUser?.photoURL || "https://via.placeholder.com/40",
              }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold">{postUser?.name || "User"}</Text>
              <Text className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Content */}
          <Text className="text-base text-gray-800 mb-3">{post.content}</Text>

          {/* Images */}
          {post.images?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row space-x-3"
            >
              {post.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-48 h-40 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Comments */}
        <Text className="text-lg font-semibold mb-3">Comments</Text>
        {comments.length === 0 ? (
          <Text className="text-gray-500">No comments yet.</Text>
        ) : (
          comments.map((cmt) => {
            const user = commentUsers[cmt.user];
            return (
              <View key={cmt.id} className="flex-row items-start mb-4">
                <Image
                  source={{
                    uri: user?.photoURL || "https://via.placeholder.com/40",
                  }}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold">
                    {user?.name || "Unknow"}
                  </Text>
                  <Text className="text-gray-700">{cmt.content}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {new Date(cmt.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input */}
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            className="bg-blue-500 rounded-full p-2"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostScreen;
