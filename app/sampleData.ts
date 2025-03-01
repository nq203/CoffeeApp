import { User, CoffeeShop, Review, ForumPost, Comment, } from "./Types/types";

export const sampleUser: User = {
    id: 1,
    username: "quannv",
    password: "1",
    email: "quannv@gmail.com",
    favorites: ["Espresso", "Latte"],
    favorite_cafes: [],
    created_at: "2025-02-20T08:00:00Z",
    updated_at: "2025-02-20T08:00:00Z"
};

export const sampleCoffeeShop: CoffeeShop = {
    id: 1,
    name: "Brew Haven",
    address: "123 Coffee St, New York, NY",
    latitude: 21.001069049927082,
    longitude: 105.87577899542988,
    opening_hours: "07:00",
    closing_hours: "22:00",
    images: [
        "https://picsum.photos/800/600?random=1",
        "https://picsum.photos/800/600?random=2",
        "https://picsum.photos/800/600?random=3"
    ],
    amenities: ["WiFi", "Outdoor Seating", "Pet-Friendly"],
    reviews: [],
    created_at: "2025-02-20T08:00:00Z",
    updated_at: "2025-02-20T08:00:00Z"
};
 

export const sampleReview: Review = {
    id: 1,
    user: sampleUser,
    coffee_shop: sampleCoffeeShop,
    rating_space: 4,
    rating_service: 5,
    rating_drinks: 4,
    rating_price: 3,
    comment: "Great ambiance and friendly staff!",
    images: ["review1.jpg"],
    created_at: "2025-02-20T08:10:00Z"
};

export const sampleForumPost: ForumPost = {
    id: 1,
    content: "What's the best coffee shop in NYC?",
    comments: [],
    images: [],
    created_at: "2025-02-20T09:00:00Z"
};

export const sampleComment: Comment = {
    id: 1,
    user: sampleUser,
    content: "I highly recommend Brew Haven!",
    created_at: "2025-02-20T09:10:00Z"
};