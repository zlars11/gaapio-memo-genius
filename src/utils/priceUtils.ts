
// Price mapping for products, tiers, and add-ons
export const PRICE_MAP = {
  // Base products + tiers
  memos: {
    emerging: "price_memos_emerging",
    midMarket: "price_memos_midmarket",
    enterprise: "price_memos_enterprise",
  },
  disclosures: {
    emerging: "price_disclosures_emerging",
    midMarket: "price_disclosures_midmarket",
    enterprise: "price_disclosures_enterprise",
  },
  bundle: {
    emerging: "price_bundle_emerging",
    midMarket: "price_bundle_midmarket",
    enterprise: "price_bundle_enterprise",
  },
  // Add-ons
  addons: {
    disclosures: {
      emerging: "price_addon_disclosures_emerging",
      midMarket: "price_addon_disclosures_midmarket",
      enterprise: "price_addon_disclosures_enterprise",
    },
    cpaReview: "price_addon_cpareview"
  }
};

// Pricing info (for display purposes)
export const PRICING_INFO = {
  memos: {
    emerging: 400,
    midMarket: 700,
    enterprise: 1000,
  },
  disclosures: {
    emerging: 400,
    midMarket: 700,
    enterprise: 1000,
  },
  bundle: {
    emerging: 700, // Bundle discount
    midMarket: 1200, // Bundle discount
    enterprise: 1800, // Bundle discount
  },
  addons: {
    disclosures: {
      emerging: 300,
      midMarket: 500,
      enterprise: 800,
    },
    cpaReview: 1000
  }
};

// Feature mapping by product type
export const getProductFeatures = (
  productType: "memos" | "disclosures" | "bundle",
  tier: "emerging" | "midMarket" | "enterprise"
) => {
  // Base features for all products and tiers
  const baseFeatures = [
    "Internal approvals",
    "Version history"
  ];
  
  // Tier-specific features
  const tierFeatures = {
    emerging: ["Up to 3 users"],
    midMarket: ["Up to 6 users", "Audit package"],
    enterprise: ["Unlimited users", "Audit package"]
  };
  
  // Product-specific features
  const productText = {
    memos: "AI-generated memos",
    disclosures: "AI-generated disclosures",
    bundle: "AI-generated memos and disclosures"
  };
  
  return [
    ...tierFeatures[tier],
    `Unlimited ${productText[productType]}`,
    ...baseFeatures
  ];
};

// Stripe keys based on environment
export const getStripeKeys = () => {
  // For simplicity, we're using test keys by default
  // In a production environment, you would use an environment variable
  const isTestMode = true; // Set to false for production
  
  return {
    publishableKey: "pk_test_51RKAy0Qx8kjcVg7rznYCuyOCUMvaIzYUPNF9FNlASoI1CgpYydWWFlEjT4GmHKWAQHeeYeNOpFq68CPjW4ONJsCQ00MjcVPJxc",
    secretKey: "sk_test_51RKAy0Qx8kjcVg7r4X43uzNmW15xkbQ9sb6kPjcIxm1ZttIRukTCUJCSzkTzxbgsDmZMqWwYkckJ9B2qwMKvKTQ200gKRtO9iU"
  };
};

// Get total price based on selections
export const calculateTotalPrice = (
  product: "memos" | "disclosures" | "bundle",
  tier: "emerging" | "midMarket" | "enterprise",
  addDisclosures: boolean,
  cpaReviewCount: number
) => {
  let total = PRICING_INFO[product][tier];
  
  if (product === "memos" && addDisclosures) {
    total += PRICING_INFO.addons.disclosures[tier];
  }
  
  if (cpaReviewCount > 0) {
    total += PRICING_INFO.addons.cpaReview * cpaReviewCount;
  }
  
  return total;
};

// Get price IDs for Stripe checkout based on selections
export const getSelectedPriceIds = (
  product: "memos" | "disclosures" | "bundle",
  tier: "emerging" | "midMarket" | "enterprise",
  addDisclosures: boolean,
  cpaReviewCount: number
): string[] => {
  const priceIds = [PRICE_MAP[product][tier]];
  
  if (product === "memos" && addDisclosures) {
    priceIds.push(PRICE_MAP.addons.disclosures[tier]);
  }
  
  if (cpaReviewCount > 0) {
    for (let i = 0; i < cpaReviewCount; i++) {
      priceIds.push(PRICE_MAP.addons.cpaReview);
    }
  }
  
  return priceIds;
};
