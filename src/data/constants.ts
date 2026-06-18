import { FiAward, FiClock, FiMapPin, FiShield } from "react-icons/fi";

export const restaurantName = "Aurora Table";

export const menuCategories = [
  "Starters",
  "Salads",
  "Pasta",
  "Pizza",
  "Burgers",
  "Main Courses",
  "Seafood",
  "Desserts",
  "Drinks",
];

export const timeSlots = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

export const whyChooseUs = [
  {
    title: "Seasonal cooking",
    description: "A concise menu built around peak ingredients and classic technique.",
    icon: FiAward,
  },
  {
    title: "Thoughtful reservations",
    description: "Choose your table from a clear floor layout and receive instant confirmation.",
    icon: FiShield,
  },
  {
    title: "Warm service",
    description: "Professional hospitality with a calm, comfortable dining room.",
    icon: FiClock,
  },
  {
    title: "Central location",
    description: "Easy to reach for dinners, business meals, and special occasions.",
    icon: FiMapPin,
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
];

export const fallbackFeaturedDishes = [
  {
    id: 1,
    name: "Tagliatelle al Ragu",
    description: "Fresh pasta with slow-braised beef ragu and pecorino.",
    price: 24,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Prime New York Strip",
    description: "12 oz strip steak, roasted garlic butter, and pommes frites.",
    price: 46,
    category: "Main Courses",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon, fennel, citrus beurre blanc, and crispy capers.",
    price: 32,
    category: "Seafood",
    imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
  },
];
