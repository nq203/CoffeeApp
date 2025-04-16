import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ForumPost, User } from '@/app/Types/types';
import { getUser } from '@/Firebase/Services/userService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/Types/types';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native';

type PostCardNavigationProp = StackNavigationProp<RootStackParamList, 'Post'>;

interface PostProps {
  post: ForumPost;
  onPress?: () => void;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
    const navigation = useNavigation<PostCardNavigationProp>();
    const [postUser, setPostUser] = useState<User | null>(null);
    const {user} = useSelector((state : RootState) => state.user);
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
      <View className="flex-row items-center border-t border-gray-200 pt-2">
        <Image
          source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
          className="w-8 h-8 rounded-full mr-2"
        />
        <View className="flex-1 bg-gray-100 rounded-full px-3 py-1 mr-2">
          <Text className="text-gray-500 text-sm">Send message...</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard; 