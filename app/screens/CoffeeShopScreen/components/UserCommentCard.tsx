import { View, Text } from "react-native";
import React from "react";
import { Review } from "@/app/Types/types";
const UserCommentCard: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating_drinks, 0) /
          reviews.length
        ).toFixed(1)
      : "Chưa có";
  return (
    <View>
      <View className="items-center mb-4">
        <Text className="text-lg font-semibold">
          Trung bình đánh giá: {averageRating} / 5
        </Text>
        <Text className="text-gray-500">{reviews.length} đánh giá</Text>
      </View>
      <Text className="text-lg font-semibold mb-2">
        Đánh giá từ khách hàng:
      </Text>
      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
            <Text className="font-bold">{review.user}</Text>
            <Text className="text-gray-700">{review.comment}</Text>
            <View className="flex-row mt-2">
              <Text className="text-yellow-500 mr-2">
                ⭐ {review.rating_drinks}/5
              </Text>
              <Text className="text-gray-500 text-sm">
                {new Date(review.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text className="text-gray-500">Chưa có đánh giá nào.</Text>
      )}
    </View>
  );
};

export default UserCommentCard;
