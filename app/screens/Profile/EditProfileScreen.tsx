import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { getUser, updateUser } from "@/Firebase/Services/userService";
import { getAllUtilities } from "@/Firebase/Services/utilitiesService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import * as ImagePicker from "expo-image-picker";
import { Edit } from "lucide-react-native";
import { setUser } from "@/app/redux/slices/userSlice";
import { Utilities } from "@/app/Types/types";

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState<string>(user?.photoURL || '');
  const [updateImage, setUpdateImage] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    password: "",
    favorites: user?.favorites || [],
    photoURL: user?.photoURL || "",
  });
  const [utilities, setUtilities] = useState<Utilities[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUtilities();
  }, []);

  const fetchUtilities = async () => {
    const data = await getAllUtilities();
    setUtilities(data);
  };

  const toggleUtility = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((u) => u !== id)
        : [...prev.favorites, id],
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUpdateImage(true);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        photoURL: updateImage ? image : formData.photoURL,
      };
      if (user) {
        const result = await updateUser(user.id, updatedData);
        if (result.success) {
          Alert.alert("Success", "Profile updated successfully!");
          const data = await getUser(user.id);
          if (data) dispatch(setUser(data));
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-[#F6F1ED]">
      {/* Profile Card */}
      <View className="items-center mb-6">
        <Pressable onPress={pickImage}>
          <View className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-center text-gray-500 mt-12">No Image</Text>
            )}
          </View>
          <View className="absolute bottom-0 right-0 w-8 h-8 bg-[#854836] rounded-full flex items-center justify-center">
            <Edit size={20} color="white" />
          </View>
        </Pressable>
      </View>

      {/* Update Name */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold text-[#8B4513] mb-2">Update Name</Text>
        <TextInput
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholder="Enter your name"
          className="border border-gray-300 rounded-lg p-2"
        />
      </View>

      {/* Update Password */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold text-[#8B4513] mb-2">Update Password</Text>
        <TextInput
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Enter a new password"
          secureTextEntry
          className="border border-gray-300 rounded-lg p-2"
        />
      </View>

      {/* Select Utilities */}
      <View className="bg-white rounded-xl p-4 shadow-md mb-4">
        <Text className="text-lg font-semibold text-[#8B4513] mb-2">Sở thích quán cafe</Text>
        <View className="flex-row flex-wrap">
          {utilities.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleUtility(item.id)}
              className={`px-4 py-2 rounded-full m-1 border ${
                formData.favorites.includes(item.id) ? "bg-[#854836] border-[#854836]" : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`${
                  formData.favorites.includes(item.id) ? "text-white" : "text-gray-800"
                } font-semibold`}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between mt-6">
        <Pressable
          onPress={handleUpdateProfile}
          className={`px-6 py-3 rounded-lg ${
            loading ? "bg-gray-300" : "bg-[#8B4513]"
          }`}
        >
          <Text className="text-white font-bold">
            {loading ? "Updating..." : "Lưu"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="px-6 py-3 rounded-lg bg-gray-400"
        >
          <Text className="text-white font-bold">Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
