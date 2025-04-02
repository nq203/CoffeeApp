import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ForumPost, Comment, RootStackParamList } from '@/app/Types/types';
import { addComment } from '@/Firebase/Services/forumService';
import { auth } from '@/Firebase/firebaseConfig';
import PostCard from './components/PostCard';

type PostScreenRouteProp = RouteProp<RootStackParamList, 'Post'>;

const PostScreen = () => {
  const route = useRoute<PostScreenRouteProp>();
  const navigation = useNavigation();
  const { post } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User must be authenticated to add a comment');
      }

      const commentData: Omit<Comment, 'id' | 'created_at'> = {
        content: comment.trim(),
        user: currentUser.uid,
        liked: [],
      };

      await addComment(commentData);
      setComment('');
      // Refresh comments
      // TODO: Implement getComments function
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-2">Post Details</Text>
      </View>

      {/* Post Content */}
      <FlatList
        data={[post]}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={item => item.id}
        className="flex-1"
        ListFooterComponent={
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold mb-4">Comments</Text>
            {comments.map((comment) => (
              <View key={comment.id} className="flex-row items-start mb-4">
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold">User Name</Text>
                  <Text className="text-gray-600">{comment.content}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {new Date(comment.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        }
      />

      {/* Comment Input */}
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