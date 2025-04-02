import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
  return (
    <View className="mb-2.5 rounded-lg ">
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text className="font-bold text-lg">{group.title}</Text>
        <View className="flex flex-row flex-wrap p-2.5 h-[200px]">
           {group.images.slice(0, 4).map((image, index) => (
            <Image
            key={index}
            source={{ uri: image }}
            className="w-1/2 h-1/2 border-2 border-white rounded-lg"
          />
           ))}
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
