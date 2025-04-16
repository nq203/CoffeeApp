import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import {
  MapPin,
  Lightbulb,
  Star,
  MessageCircle,
  Heart,
  Settings,
  Users,
} from "lucide-react-native";

const slides = [
  {
    title: "Chào mừng đến với CafeFinder",
    subtitle: "Khám phá, đánh giá và chia sẻ quán cafe yêu thích của bạn.",
    icon: MapPin,
    bgColor: "#F6F1ED",      // tone nền chính
    textColor: "#5D4037",    // nâu đậm
  },
  {
    title: "Tìm Quán & Gợi Ý",
    subtitle: "Tìm quán gần bạn và nhận đề xuất theo sở thích.",
    icon: Lightbulb,
    bgColor: "#EFE6DD",
    textColor: "#6D4C41",
  },
  {
    title: "Đánh Giá & Chia Sẻ",
    subtitle: "Viết nhận xét, chấm điểm và chia sẻ hình ảnh về quán.",
    icon: Star,
    secondIcon: MessageCircle,
    bgColor: "#F3E8E3",
    textColor: "#8D6E63",
  },
  {
    title: "Lưu & Tùy Chỉnh",
    subtitle: "Lưu lại quán yêu thích và cá nhân hóa trải nghiệm của bạn.",
    icon: Heart,
    secondIcon: Settings,
    bgColor: "#EDE0D4",
    textColor: "#795548",
  },
];

export default function OnboardingSwiper() {
  const navigation = useNavigation();

  return (
    <Swiper loop={false} showsPagination={true} showsButtons={false} activeDotColor={"#854836"} >
      {slides.map((slide, index) => {
        const Icon1 = slide.icon;
        const Icon2 = slide.secondIcon;
        return (
          <View
            key={index}
            className="flex-1 items-center justify-center px-8"
            style={{ backgroundColor: slide.bgColor }}
          >
            <View className="flex-row items-center space-x-4 mb-6">
              <Icon1 size={70} color={slide.textColor} />
              {Icon2 && <Icon2 size={70} color={slide.textColor} />}
            </View>
            <Text
              className="text-2xl font-bold mb-3 text-center"
              style={{ color: slide.textColor }}
            >
              {slide.title}
            </Text>
            <Text
              className="text-base text-center"
              style={{ color: slide.textColor }}
            >
              {slide.subtitle}
            </Text>
          </View>
        );
      })}

      {/* Slide cuối - chọn sở thích */}
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: "#F6F1ED" }}>
        <Users size={80} color="#5D4037" className="mb-6" />
        <Text className="text-2xl font-bold mb-4 text-center text-[#5D4037]">
          Cá nhân hóa trải nghiệm
        </Text>
        <Text className="text-base text-center text-[#795548] mb-6">
          Chọn sở thích cafe để nhận đề xuất phù hợp hơn với bạn.
        </Text>
        <TouchableOpacity
          className="px-6 py-3 rounded-full"
          style={{ backgroundColor: "#5D4037" }}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text className="text-white text-base font-semibold">Bắt đầu chọn sở thích</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
}
