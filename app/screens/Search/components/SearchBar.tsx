import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { MapPin, Search } from "lucide-react-native";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearchChange = (text: string) => {
    // setSearchTerm(text);
    onSearch(text);
  };
  return (
    <View className="flex-row items-center bg-[#F5F5F5] rounded-xl px-4 py-2 shadow-md">
      <TextInput
        placeholder="Tìm kiếm"
        className="flex-1 text-base"
        // value={searchTerm}
        onChangeText={handleSearchChange}
      />
      <Pressable>
        <MapPin size={24} color="#8B4513" />
      </Pressable>
    </View>
  );
};

export default SearchBar;
