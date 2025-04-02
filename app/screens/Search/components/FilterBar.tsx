import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronDown, CheckCircle } from "lucide-react-native";

const filters = [
  { name: "Sở thích", icon: ChevronDown },
  { name: "Khoảng cách", icon: ChevronDown },
  { name: "Đang mở cửa", icon: CheckCircle },
];

const FilterBar = () => {
  return (
    <View className="mt-4 pb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {filters.map((filter, index) => (
          <Pressable
            key={index}
            className="flex-row items-center px-4 py-2 bg-[#F5F5F5] rounded-full shadow-sm mr-2"
          >
            <filter.icon size={16} color="#8B4513" />
            <Text className="ml-2 text-[#8B4513]">{filter.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterBar;
