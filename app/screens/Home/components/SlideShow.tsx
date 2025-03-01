import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

// Sample images (Replace these with your actual image URLs)
// const images = [
//   "https://source.unsplash.com/random/800x600?coffee",
//   "https://source.unsplash.com/random/800x600?cafe",
//   "https://source.unsplash.com/random/800x600?latte",
// ];
const images = [
  require("../../../../assets/images/coffee1.jpg"),
  require("../../../../assets/images/coffee2.jpg"),
  require("../../../../assets/images/coffee3.jpg"),
];
const SlideShow = () => {
  return (
    <Swiper autoplay autoplayTimeout={10} showsPagination={true} activeDotColor={"#854836"} className="w-full h-[250px]">
      {images.map((image, index) => (
        <View key={index} className="rounded-lg overflow-hidden">
            <Image 
              source={typeof image === "string" ? { uri: image } : image} 
              className="w-full h-[200px]"
            />
        </View>
      ))}
    </Swiper>
  );
};

export default SlideShow;
