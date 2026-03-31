import painting1 from "@/assets/painting1.jpg";
import painting2 from "@/assets/painting2.jpg";
import painting3 from "@/assets/painting3.jpg";
import painting4 from "@/assets/painting4.jpg";
import painting5 from "@/assets/painting5.jpg";
import painting6 from "@/assets/painting6.jpg";

export interface Painting {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  dimensions: string;
  medium: string;
  year: number;
  sold: boolean;
}

export const paintings: Painting[] = [
  {
    id: "1",
    title: "Golden Horizon",
    description: "A breathtaking landscape capturing the raw beauty of a sunset over turbulent seas. Rich gold and crimson tones evoke deep emotion.",
    price: 45000,
    originalPrice: 55000,
    image: painting1,
    category: "Abstract",
    dimensions: "36\" × 48\"",
    medium: "Oil on Canvas",
    year: 2024,
    sold: false,
  },
  {
    id: "2",
    title: "Serene Waters",
    description: "An impressionist masterpiece depicting a tranquil lake at golden hour. Soft pastel hues create an ethereal dreamlike atmosphere.",
    price: 32000,
    image: painting2,
    category: "Landscape",
    dimensions: "40\" × 30\"",
    medium: "Watercolor",
    year: 2024,
    sold: false,
  },
  {
    id: "3",
    title: "Royal Geometry",
    description: "Bold geometric composition with deep purple tones and gold leaf accents. A statement piece that commands attention in any space.",
    price: 68000,
    image: painting3,
    category: "Contemporary",
    dimensions: "48\" × 48\"",
    medium: "Mixed Media",
    year: 2023,
    sold: true,
  },
  {
    id: "4",
    title: "Renaissance Grace",
    description: "A classical portrait rendered with masterful chiaroscuro technique. Inspired by the great masters of the Italian Renaissance.",
    price: 85000,
    image: painting4,
    category: "Portrait",
    dimensions: "30\" × 40\"",
    medium: "Oil on Canvas",
    year: 2023,
    sold: false,
  },
  {
    id: "5",
    title: "Floral Symphony",
    description: "A stunning still life in the tradition of Dutch Golden Age masters. Each petal rendered with extraordinary detail and luminosity.",
    price: 52000,
    originalPrice: 60000,
    image: painting5,
    category: "Still Life",
    dimensions: "36\" × 36\"",
    medium: "Oil on Canvas",
    year: 2024,
    sold: false,
  },
  {
    id: "6",
    title: "Cosmic Dreams",
    description: "An expansive cosmic vision blending deep blues, purples, and golden stardust. A meditation on the infinite nature of the universe.",
    price: 72000,
    image: painting6,
    category: "Abstract",
    dimensions: "60\" × 60\"",
    medium: "Acrylic & Gold Leaf",
    year: 2024,
    sold: false,
  },
];
