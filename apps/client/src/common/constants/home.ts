import {
  BarChart,
  Calendar,
  History,
  Home,
  Leaf,
  Lightbulb,
  Salad,
  Search,
  Tag,
  TrendingUp
} from "lucide-react";

export const itemsSideBar = [
  {
    title: "Home",
    url: "/",
    icon: Home
  },
  {
    title: "History Posts",
    url: "#",
    icon: History
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar
  },
  {
    title: "Search",
    url: "#",
    icon: Search
  }
];

export const defaultPrompts = [
  {
    content: "Post motivacional.",
    icon: Lightbulb
  },
  {
    content: "Carrossel de marketing.",
    icon: BarChart
  },
  {
    content: "Foco em nutrição.",
    icon: Salad
  },
  {
    content: "Publicação promocional.",
    icon: Tag
  },
  {
    content: "Posts ao bem-estar.",
    icon: Leaf
  },
  {
    content: "Aumentar engajamento.",
    icon: TrendingUp
  }
];
