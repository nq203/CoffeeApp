import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { ChevronDown, CheckCircle } from "lucide-react-native";
import { Utilities } from "@/app/Types/types";
import { getAllUtilities } from "@/Firebase/Services/utilitiesService";
import { Dropdown } from "react-native-element-dropdown";
const filters = [
  { name: "Sở thích", icon: ChevronDown },
  { name: "Địa điểm", icon: ChevronDown },
];
interface FilterProps {
  onFilter: (favorite: number | null, address: string) => void;
}
const FilterBar: React.FC<FilterProps> = ({ onFilter }) => {
  const [favorites, setFavorites] = useState<Utilities[]>([]);
  const [address, setAddress] = useState<string>("");
  const [selectedFavorite, setSelectedFavorite] = useState<number | null>(null);
  const handleAdressChange = (text: string) => {
    // setSearchTerm(text);
    setAddress(text);
  };
  useEffect(() => {
    async function fetchFavorites() {
      const data = await getAllUtilities();
      setFavorites(data);
    }
    fetchFavorites();
  }, []);
  useEffect(() => {
    onFilter(selectedFavorite, address);
  }, [selectedFavorite, address]);
  return (
    <View style={styles.container}>
        {/* Dropdown for Sở thích */}
        <View style={styles.filterItem}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Tất cả", value: null },
              ...favorites.map((item) => ({
                label: item.name,
                value: item.code,
              })),
            ]}
            placeholder="Sở Thích"
            labelField="label"
            valueField="value"
            value={selectedFavorite}
            onChange={(item) => setSelectedFavorite(item.value)}
            iconColor="#8B4513"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            containerStyle={styles.dropdownContainer}
            renderRightIcon={() => <ChevronDown size={16} color="#8B4513" />}
          />
        </View>

        {/* TextInput for địa chỉ */}
        <View style={styles.filterItem}>
          <TextInput
            value={address}
            onChangeText={handleAdressChange}
            placeholder="Nhập địa chỉ..."
            style={styles.textInput}
            placeholderTextColor="gray"
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
    flex: 1, 
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdown: {
    width:140,
    height: 20,
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  placeholder: {
    color: "#8B4513",
    fontSize: 14,
  },
  selectedText: {
    color: "#8B4513",
    fontSize: 14,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});

export default FilterBar;
