import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import { CoffeeShop } from "@/app/Types/types";
import { getAllCoffeeShops } from "@/Firebase/Services/coffeeShopService";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { getDistanceFromUser } from "@/app/utils/distance";

const SreachScreen = () => {
  const [filterName,setFilterName] = useState<string>("");
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [filterCoffeeShops,setFilterCoffeeShops] = useState<CoffeeShop[]>([]);
  const { location, loading } = useSelector((state: RootState) => state.location);
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

  useEffect(() => {
    if (!location) {
      // If location is unavailable, just filter by name
      const filteredByName = coffeeShops.filter((shop) =>
        shop.name.toLowerCase().includes(filterName.toLowerCase())
      );
      setFilterCoffeeShops(filteredByName);
    } else {
      // Filter by name and sort by distance
      const filteredAndSorted = coffeeShops
        .filter((shop) =>
          shop.name.toLowerCase().includes(filterName.toLowerCase())
        )
        .map((shop) => ({
          ...shop,
          distance: getDistanceFromUser(
            location.coords.latitude,
            location.coords.longitude,
            shop.latitude,
            shop.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance); // Sort by distance (ascending)
      setFilterCoffeeShops(filteredAndSorted);
    }
  }, [filterName, coffeeShops, location]);
  return (
    <View className="flex-1 justify-start item-center p-2.5 bg-[#D8D2C2]">
      <SearchBar onSearch={onSearch}/>
      <FilterBar />
      <ScrollView>
          {filterCoffeeShops.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} location={location} />
          ))}
        </ScrollView>
    </View>
  );
};

export default SreachScreen;
