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
import CoffeeShopCard from "../../components/CoffeeShopCard";
import * as Location from "expo-location";
import {
  getAllCoffeeShops,
  getListCoffeeShopById,
  getListCoffeeShopByUserFavorite,
} from "@/Firebase/Services/coffeeShopService";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
interface Props {
  location: Location.LocationObject | null;
}

const RecommendCoffeeShop: React.FC<Props> = ({ location }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [expanded, setExpanded] = useState(true);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  useEffect(() => {
    const fetchData = async () => {
        if(!user) return
        const data  = await getListCoffeeShopByUserFavorite(user?.favorites);
        if(!data) return
        setCoffeeShops(data);
    };
    fetchData();
  }, [expanded]);
  return (

        <ScrollView className="mb-2.5 rounded-lg ">
          {coffeeShops.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} location={location} />
          ))}
        </ScrollView>
  );
};

export default RecommendCoffeeShop;
