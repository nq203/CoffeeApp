import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import { CoffeeShop } from "@/app/Types/types";
import { getAllCoffeeShops } from "@/Firebase/Services/coffeeShopService";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getDistanceFromUser } from "@/app/utils/distance";
import RecommendCoffeeShop from "./components/RecommendCoffeeShop";

const SreachScreen = () => {
  const [filterName, setFilterName] = useState<string>("");
  const [filteraddress, setFilterAdress] = useState<string>("");
  const [filterFavorite, setFilterFavorite] = useState<number | null>();
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [filterCoffeeShops, setFilterCoffeeShops] = useState<CoffeeShop[]>([]);
  const [showRecommend, setShowRecommend] = useState<boolean>(true); // Toggle state
  const { location } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    const fetchCoffeeShops = async () => {
      try {
        const data = await getAllCoffeeShops();
        if (data) setCoffeeShops(data);
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
      }
    };
    fetchCoffeeShops();
  }, []);

  const onSearch = (text: string) => setFilterName(text);

  const onFilter = (utility: number | null, address: string) => {
    setFilterFavorite(utility);
    setFilterAdress(address);
    setShowRecommend(false); // Automatically switch to search mode when filtering
  };

  useEffect(() => {
    let currentCoffeeShopfilter = [...coffeeShops];

    if (location) {
      currentCoffeeShopfilter = currentCoffeeShopfilter
        .map((shop) => ({
          ...shop,
          distance: getDistanceFromUser(
            location.coords.latitude,
            location.coords.longitude,
            shop.latitude,
            shop.longitude
          ),
        }))
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    if (filterName) {
      currentCoffeeShopfilter = currentCoffeeShopfilter.filter((shop) =>
        shop.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filteraddress) {
      currentCoffeeShopfilter = currentCoffeeShopfilter.filter((shop) =>
        shop.address.toLowerCase().includes(filteraddress.toLowerCase())
      );
    }

    if (filterFavorite !== null && filterFavorite !== undefined) {
      currentCoffeeShopfilter = currentCoffeeShopfilter.filter((shop) =>
        shop.utilities.includes(filterFavorite)
      );
    }

    setFilterCoffeeShops(currentCoffeeShopfilter);
  }, [filterName, filterFavorite, filteraddress, coffeeShops, location]);

  return (
    <View className="flex-1 justify-start item-center p-2.5 bg-[#F6F1ED]">
      <SearchBar onSearch={onSearch} />
      <FilterBar onFilter={onFilter} />

      {/* Toggle Buttons */}
      <View className="flex-row justify-around my-3">
        <TouchableOpacity
          onPress={() => setShowRecommend(true)}
          className={`px-4 py-2 rounded-xl ${
            showRecommend ? "bg-[#854836]" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold">Gợi ý cho bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowRecommend(false)}
          className={`px-4 py-2 rounded-xl ${
            !showRecommend ? "bg-[#854836]" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold">Tìm kiếm quán cafe</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Content */}
      {showRecommend ? (
        <RecommendCoffeeShop location={location} />
      ) : (
        <ScrollView>
          {filterCoffeeShops.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} location={location} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default SreachScreen;
