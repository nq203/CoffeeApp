import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { CoffeeShop, GroupOfCoffeeShop } from "@/app/Types/types";
import CoffeeShopCard from "./CoffeeShopCard";
import * as Location from "expo-location";
import {
  getAllCoffeeShops,
  getListCoffeeShopById,
} from "@/Firebase/Services/coffeeShopService";
import { ScrollView } from "react-native-gesture-handler";
interface Props {
  group: GroupOfCoffeeShop;
  location: Location.LocationObject | null;
}

const GroupCoffeeShopCard: React.FC<Props> = ({ group, location }) => {
  const [expanded, setExpanded] = useState(false);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getListCoffeeShopById(group.coffeeshop_ids);
      setCoffeeShops(data);
    };
    fetchData();
  }, [expanded]);
  const randomImage = useMemo(() => {
    if (!group.images || group.images.length === 0) return null;
    const index = Math.floor(Math.random() * group.images.length);
    return group.images[index];
  }, [group.images]);
  return (
    <View className="mb-2.5 rounded-lg ">
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View className="relative h-[250px] rounded-lg overflow-hidden">
          {/* Blurred Background */}
          <ImageBackground
            source={{ uri: randomImage }}
            className="w-full h-full justify-end bg-b"
          >
            {/* Optional dark overlay for better contrast */}
            <View className="absolute inset-0 bg-black/30 rounded-lg" />

            {/* Title Text */}
            <View className="pb-5 items-center">
              <Text className="text-white font-bold text-xl px-4 py-2 rounded-lg">
                {group.title}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
      {expanded && (
        <ScrollView>
          {coffeeShops.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} location={location} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default GroupCoffeeShopCard;
