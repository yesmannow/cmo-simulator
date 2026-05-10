import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Handshake,
  Megaphone,
  Newspaper,
  Presentation,
  Tv,
} from "lucide-react";

export interface StrategyChannelOption {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const STRATEGY_CHANNEL_OPTIONS: StrategyChannelOption[] = [
  {
    id: "digital",
    name: "Digital Marketing",
    icon: Globe,
    description: "Paid digital, web acquisition, and measurable demand capture.",
  },
  {
    id: "social",
    name: "Social Media",
    icon: Megaphone,
    description: "Organic and paid social momentum, community, and visibility.",
  },
  {
    id: "traditional",
    name: "Traditional Media",
    icon: Tv,
    description: "Broadcast and broad-reach brand investment.",
  },
  {
    id: "content",
    name: "Content Marketing",
    icon: Newspaper,
    description: "Thought leadership, education, and long-tail audience capture.",
  },
  {
    id: "events",
    name: "Events & Experiences",
    icon: Presentation,
    description: "Field marketing, launches, activations, and in-person demand.",
  },
  {
    id: "partnerships",
    name: "Partnerships",
    icon: Handshake,
    description: "Distribution leverage, channel relationships, and co-marketing.",
  },
];

export const STRATEGY_AUDIENCE_PRESETS: readonly string[] = [
  "Young Professionals (25-35)",
  "Families with Children",
  "Tech-Savvy Millennials",
  "Budget-Conscious Consumers",
  "Premium/Luxury Seekers",
  "Small Business Owners",
];

export const STRATEGY_POSITIONING_PRESETS: readonly string[] = [
  "Premium Quality Leader",
  "Best Value for Money",
  "Innovation & Technology",
  "Sustainability & Ethics",
  "Customer Service Excellence",
  "Convenience & Speed",
];
