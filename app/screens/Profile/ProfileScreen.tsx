import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView,RefreshControl } from "react-native";
import { logoutUser } from "@/Firebase/Services/authService";
import { getFavoriteCafes } from "@/Firebase/Services/userService";
import { CoffeeShop } from "@/app/Types/types";
import { getListCoffeeShopById } from "@/Firebase/Services/coffeeShopService";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { LogOutIcon } from "lucide-react-native";
const ProfileScreen = ({navigation}:any) => {
  const [favorites, setFavorites] = useState<CoffeeShop[]>([]);
  const { location } = useSelector((state: RootState) => state.location);
  const {user} = useSelector((state : RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getListFavoriteCoffee();
  }, [user]);
  const getListFavoriteCoffee = async () => {
    if (user) {
      const idList = await getFavoriteCafes(user.id);
      setFavorites(await getListCoffeeShopById(idList));
    }
  }
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Bạn chưa đăng nhập</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F6F1ED]" refreshControl={<RefreshControl refreshing={refreshing}
      onRefresh={getListFavoriteCoffee}
    />}>
      {/* Header */}
      <View className="p-5 rounded-b-3xl ">
        <Text className="text-2xl font-bold text-black">Thông tin cá nhân</Text>
        <View className="flex-row items-center justify-between mt-3">
          {/* Avatar và thông tin user */}
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.photoURL || "https://i.pravatar.cc/150" }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-xl font-bold">{user.name}</Text>
              <Text className="text-gray-700">{user.email}</Text>
            </View>
          </View>

          {/* Nút đăng xuất */}
          <Pressable onPress={logoutUser} className="p-2 bg-[#854836] rounded-full">
            <LogOutIcon size={24} color="white" />
          </Pressable>
        </View>

        {/* Nút Chỉnh sửa & Đóng góp */}
        <View className="flex-row mt-4 justify-around">
          <Pressable className="bg-white px-4 py-2 rounded-lg mr-2" onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-black font-bold">Chỉnh sửa</Text>
          </Pressable>
          <Pressable className="bg-white px-4 py-2 rounded-lg">
            <Text className="text-black font-bold">Đóng góp</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around bg-[#D2B48C] p-3 mt-3 rounded-t-3xl ">
        <Text className="font-bold ]">Các quán cafe yêu thích</Text>
      </View>

      {/* Danh sách quán yêu thích */}
      <View className="">
        {favorites.length > 0 ? (
          favorites.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} location={location} />
          ))
        ) : (
          <Text className="text-gray-500 text-center mt-5">
            Chưa có quán yêu thích
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
