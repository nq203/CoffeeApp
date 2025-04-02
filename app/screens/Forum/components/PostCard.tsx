import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ForumPost, User } from '@/app/Types/types';
import { getUser } from '@/Firebase/Services/userService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/Types/types';

type PostCardNavigationProp = StackNavigationProp<RootStackParamList, 'Post'>;

interface PostProps {
  post: ForumPost;
  onPress?: () => void;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
    const navigation = useNavigation<PostCardNavigationProp>();
    const [postUser, setPostUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchPostUser = async () => {
            console.log("id user: ",post.user);
            const user = await getUser(post.user);
            console.log("infor user: ", user);
            setPostUser(user);
        }
        fetchPostUser();
    }, [])

    const handlePress = () => {
        navigation.navigate('Post', { post });
    };

    return (
        <TouchableOpacity 
            className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm"
            onPress={handlePress}
        >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={postUser?.photoURL ? { uri: postUser.photoURL } : require('@/assets/images/default-avatar.jpg')}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="font-bold text-base">{postUser?.name}</Text>
          <Text className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleString()}
          </Text>
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
                post.images.length === 1 
                  ? 'w-full h-48' 
                  : 'w-[48%] h-40'
              }`}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Footer */}
      <View className="flex-row border-t border-gray-100 pt-3 mt-2">
        <TouchableOpacity className="flex-row items-center mr-6">
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text className="text-gray-600 ml-1">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text className="text-gray-600 ml-1">0 Comments</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard; 