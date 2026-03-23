export interface TacticEducation {
  description: string;
  strategyTip: string;
  marketImpact: string;
}

export const TACTIC_EDUCATION: Record<string, TacticEducation> = {
  "digital-1": {
    description: "Paid advertising across major social platforms (Meta, TikTok, LinkedIn) to drive immediate traffic and conversions.",
    strategyTip: "High-volume social ads are great for awareness, but watch your CAC (Customer Acquisition Cost) closely in competitive quarters.",
    marketImpact: "Immediate lift in brand awareness and short-term revenue, but requires consistent reinvestment to maintain."
  },
  "digital-2": {
    description: "Bidding on search keywords to capture high-intent users actively looking for solutions.",
    strategyTip: "SEM is the ultimate 'bottom-of-funnel' tool. Use it when you need to hit revenue targets fast.",
    marketImpact: "Highly efficient for direct conversions, but can hit diminishing returns as CPCs rise."
  },
  "digital-3": {
    description: "Partnering with industry influencers to leverage their trust and reach within specific niches.",
    strategyTip: "Focus on 'micro-influencers' with higher engagement rates rather than just raw follower count.",
    marketImpact: "Builds high brand equity and trust, creating longer-term customer loyalty than standard ads."
  },
  "content-1": {
    description: "A centralized destination for educational blogs, whitepapers, and resources to build long-term authority.",
    strategyTip: "Content pays off in quarters 3 and 4. Start early to build an 'SEO moat' that competitors can't easily buy.",
    marketImpact: "Slow start but incredible compounding ROI over time. Essential for brand awareness stability."
  },
  "traditional-1": {
    description: "Large-scale television advertising to reach a broad, multi-demographic audience.",
    strategyTip: "TV is an 'Awareness Bazooka'. Only use it if you have the budget to sustain a high frequency of reach.",
    marketImpact: "Massive brand awareness spikes, but very high entry cost and low direct attribution."
  },
  "events-1": {
    description: "High-touch physical presence at major industry conferences to capture B2B leads and partnerships.",
    strategyTip: "The magic happens in the follow-up. Ensure your CRM is ready to ingest trade show leads immediately.",
    marketImpact: "Exceptional for deepening customer satisfaction and securing high-value strategic partnerships."
  }
};

export function getTacticEducation(tacticId: string): TacticEducation {
  return TACTIC_EDUCATION[tacticId] || {
    description: "Strategic marketing initiative designed to improve core business growth metrics.",
    strategyTip: "Consider how this tactic aligns with your primary channel strategy for maximum synergy.",
    marketImpact: "Contributes to overall market share and brand positioning stability."
  };
}
