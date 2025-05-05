import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Chip } from "react-native-paper";
import { Utilities } from "@/app/Types/types";
import { getAllUtilities } from "@/Firebase/Services/utilitiesService";

interface FilterProps {
  onFilter: (favorites: number[] | null) => void;
}

const FilterBar: React.FC<FilterProps> = ({ onFilter }) => {
  const [favorites, setFavorites] = useState<Utilities[]>([]);
  const [selectedFavorites, setSelectedFavorites] = useState<number[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const data = await getAllUtilities();
      setFavorites(data);
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (selectedFavorites.length === 0) {
      onFilter(null);
    } else {
      onFilter(selectedFavorites);
    }
  }, [selectedFavorites]);

  const toggleFavorite = (code: number) => {
    if (selectedFavorites.includes(code)) {
      setSelectedFavorites(selectedFavorites.filter((item) => item !== code));
    } else {
      setSelectedFavorites([...selectedFavorites, code]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {favorites.map((item) => (
          <Chip
            key={item.code}
            mode="outlined"
            selected={selectedFavorites.includes(item.code)}
            onPress={() => toggleFavorite(item.code)}
            style={[
              styles.chip,
              selectedFavorites.includes(item.code) && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              selectedFavorites.includes(item.code) && styles.selectedChipText,
            ]}
          >
            {item.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    backgroundColor: "#F5F5F5",
    borderColor: "#8B4513",
  },
  selectedChip: {
    backgroundColor: "#8B4513",
  },
  chipText: {
    color: "#8B4513",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
});

export default FilterBar;
