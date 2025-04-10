import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import { CoffeeShop, Utilities } from "@/app/Types/types";
import { getAllCoffeeShops } from "@/Firebase/Services/coffeeShopService";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getDistanceFromUser } from "@/app/utils/distance";

const SreachScreen = () => {
  const [filterName, setFilterName] = useState<string>("");
  const [filteraddress, setFilterAdress] = useState<string>("");
  const [filterFavorite, setFilterFavorite] = useState<number | null>();
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [filterCoffeeShops, setFilterCoffeeShops] = useState<CoffeeShop[]>([]);
  const { location, loading } = useSelector(
    (state: RootState) => state.location
  );
  useEffect(() => {
    const fetchCoffeeShops = async () => {
      try {
        const data = await getAllCoffeeShops();
        if (data) {
          setCoffeeShops(data);
        }
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
      } finally {
      }
    };

    fetchCoffeeShops();
  }, []);
  const onSearch = (text: string) => {
    setFilterName(text);
  };
  const onFilter = (utility: number | null, address: string) => {
    setFilterFavorite(utility);
    setFilterAdress(address);
  };
  useEffect(() => {
    let currentCoffeeShopfilter = [...coffeeShops];

    // Tính khoảng cách
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

    // Lọc theo tên
    if (filterName) {
      currentCoffeeShopfilter = currentCoffeeShopfilter.filter((shop) =>
        shop.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Lọc theo địa chỉ
    if (filteraddress) {
      currentCoffeeShopfilter = currentCoffeeShopfilter.filter((shop) =>
        shop.address.toLowerCase().includes(filteraddress.toLowerCase())
      );
    }

    // Lọc theo tiện ích
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
      <ScrollView>
        {filterCoffeeShops.map((shop) => (
          <CoffeeShopCard key={shop.id} shop={shop} location={location} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SreachScreen;
