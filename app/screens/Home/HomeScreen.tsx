import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import SlideShow from "./components/SlideShow";
import { ScrollView } from "react-native-gesture-handler";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { sampleCoffeeShop } from "@/app/sampleData";
import { sampleReview } from "@/app/sampleData";
import * as Location from "expo-location";
import { getAllCoffeeShops } from "@/Firebase/Services/coffeeShopService";
import { CoffeeShop, GroupOfCoffeeShop } from "@/app/Types/types";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setLocation } from "@/app/redux/slices/locationSlice";
import { setUser } from "@/app/redux/slices/userSlice";
import { RootState } from "@/app/redux/store";
import { useAuth } from "@/Firebase/Services/authService";
import { getUser } from "@/Firebase/Services/userService";
import { addGroupOfCoffeeShop, getAllGroupsOfCoffeeShops } from "@/Firebase/Services/groupCoffeeShopService";
import GroupCoffeeShopCard from "../components/GroupCoffeeShopCard";
// import MapScreen from "../components/MapComponent";
const HomeScreen = () => {
  const dispatch = useDispatch();
  const { location, loading } = useSelector((state: RootState) => state.location);
  const [groupCoffeeShops, setGroupCoffeeShops] = useState<GroupOfCoffeeShop[]> ([]);
   const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();
  useEffect(()=>{
    async function storeUser() {
      if(currentUser){
        const data= await getUser(currentUser?.uid);
        console.log(data);
        if (data)
        dispatch(setUser(data));
      }
    }
    storeUser();

  },[currentUser]);
  useEffect(() => {
    async function getCurrentLocation() {
      dispatch(setLoading(true));
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Quyền truy cập vị trí bị từ chối");
        dispatch(setLoading(false));
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      dispatch(setLocation(location));
    }
    getCurrentLocation();
  }, [currentUser]);
  async function fetchGroupCoffeeShops() {
      setLoading(true);
      try {
        const data = await getAllGroupsOfCoffeeShops();
        // await addGroupOfCoffeeShop(data[0]);
        setGroupCoffeeShops(data);
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
      }
      setLoading(false);
    }
  useEffect(() => {
    

    fetchGroupCoffeeShops();
  }, []);
  return (
    <View className="flex-1 justify-start item-center p-2.5 bg-[#F6F1ED]">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchGroupCoffeeShops}/>}>
        <SlideShow />
        <View className="w-full">
        {loading ? (
            <ActivityIndicator size="large" color="#854836" />
          ) : (
            groupCoffeeShops.map((group) => (
              <GroupCoffeeShopCard key={group.id} group={group} location={location} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
