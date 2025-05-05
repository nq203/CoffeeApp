import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createForumPost } from "@/Firebase/Services/forumService";
import { useNavigation } from "@react-navigation/native";
import { CoffeeShop, ForumPost } from "@/app/Types/types";
import { AwardIcon } from "lucide-react-native";
import { getAllCoffeeShops } from "@/Firebase/Services/coffeeShopService";

const CreateForumPostScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllCoffeeShops();
      if (data) setCoffeeShops(data);
    };
    fetchData();
  }, []);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleChooseCafe = () => {};

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bài viết.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const postData: Omit<ForumPost, "id" | "created_at"> = {
        content: content.trim(),
        images: images,
        user: "",
        liked: [],
        cafeId: selectedCafe ? selectedCafe.id : undefined,
      };
      

      await createForumPost(postData);
      Alert.alert("Thành công", "Bài viết đã được đăng.");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Lỗi", "Đăng bài thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F6F1ED]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5D3C8] bg-[#FFF8F3]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B3E26" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#6B3E26]">Tạo bài viết</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`px-3 py-1 rounded-lg ${
            isSubmitting ? "bg-[#CBB3A3]" : "bg-[#854836]"
          }`}
        >
          <Text className="text-white font-semibold">
            {isSubmitting ? "Đang đăng..." : "Đăng"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-4">
        <TextInput
          className="text-base min-h-[120px] bg-white p-4 rounded-xl border border-[#E5D3C8] mb-4 text-[#3F2A1D]"
          placeholder="Bạn đang nghĩ gì khi thưởng thức cà phê?"
          placeholderTextColor="#9C7B64"
          multiline
          value={content}
          onChangeText={setContent}
        />

        {/* Image Grid */}
        {images.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {images.map((uri, index) => (
              <View
                key={index}
                className="relative w-[48%] aspect-square rounded-xl overflow-hidden"
              >
                <Image source={{ uri }} className="w-full h-full rounded-xl" />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {/* Dropdown chọn quán cafe */}
        <View className="mb-4">
          <Text className="text-[#6B3E26] font-semibold mb-2">
            Bạn muốn chia sẻ về quán Cafe nào ?
          </Text>
          <View className="bg-white rounded-xl border border-[#E5D3C8] overflow-hidden">
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="flex-row justify-between items-center p-4"
            >
              <Text className="text-[#3F2A1D]">
                {selectedCafe ? selectedCafe.name : "Chọn quán cafe..."}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#854836"
              />
            </TouchableOpacity>

            {showDropdown && (
              <View className="border-t border-[#E5D3C8]">
                {coffeeShops.map((shop) => (
                  <TouchableOpacity
                    key={shop.id}
                    onPress={() => {
                      setSelectedCafe({ id: shop.id, name: shop.name });
                      setShowDropdown(false);
                    }}
                    className="p-4 border-b border-[#F6F1ED]"
                  >
                    <Text className="text-[#3F2A1D]">{shop.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Add Image Button */}
        <TouchableOpacity
          onPress={pickImage}
          disabled={isSubmitting}
          className="flex-row items-center gap-2 border border-[#854836] px-4 py-2 rounded-xl bg-[#FFF8F3] self-start"
        >
          <Ionicons name="cafe-outline" size={20} color="#854836" />
          <Text className="text-[#854836] font-medium">Thêm ảnh</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateForumPostScreen;
