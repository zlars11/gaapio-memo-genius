
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

// Pricing info (for display purposes) - Now uses database values but fallback to these
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

// Get dynamic prices from database if available, otherwise use default values
export const getPrice = async (
  productType: "memos" | "disclosures" | "bundle",
  tier: "emerging" | "midMarket" | "enterprise"
): Promise<number> => {
  try {
    // Import supabase client here to avoid circular dependencies
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data, error } = await supabase
      .from('product_prices')
      .select('price')
      .eq('product_type', productType)
      .eq('tier', tier)
      .single();
      
    if (error) throw error;
    
    if (data && data.price !== undefined) {
      return data.price;
    }
  } catch (error) {
    console.error('Error fetching price:', error);
  }
  
  // Fallback to static prices
  return PRICING_INFO[productType][tier];
};

// Get total price based on selections
export const calculateTotalPrice = async (
  product: "memos" | "disclosures" | "bundle",
  tier: "emerging" | "midMarket" | "enterprise",
  addDisclosures: boolean,
  cpaReviewCount: number
): Promise<number> => {
  try {
    // Get base price
    let total = await getPrice(product, tier);
    
    // Add add-on prices
    if (product === "memos" && addDisclosures) {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        
        const { data, error } = await supabase
          .from('product_prices')
          .select('price')
          .eq('product_type', 'addon_disclosure')
          .eq('tier', tier)
          .single();
          
        if (error) throw error;
        
        if (data && data.price !== undefined) {
          total += data.price;
        } else {
          total += PRICING_INFO.addons.disclosures[tier];
        }
      } catch (error) {
        console.error('Error fetching add-on price:', error);
        total += PRICING_INFO.addons.disclosures[tier];
      }
    }
    
    if (cpaReviewCount > 0) {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        
        const { data, error } = await supabase
          .from('product_prices')
          .select('price')
          .eq('product_type', 'addon_cpa')
          .eq('tier', 'all')
          .single();
          
        if (error) throw error;
        
        if (data && data.price !== undefined) {
          total += data.price * cpaReviewCount;
        } else {
          total += PRICING_INFO.addons.cpaReview * cpaReviewCount;
        }
      } catch (error) {
        console.error('Error fetching CPA review price:', error);
        total += PRICING_INFO.addons.cpaReview * cpaReviewCount;
      }
    }
    
    return total;
  } catch (error) {
    console.error('Error calculating total price:', error);
    // Fallback to static price calculation
    let total = PRICING_INFO[product][tier];
    
    if (product === "memos" && addDisclosures) {
      total += PRICING_INFO.addons.disclosures[tier];
    }
    
    if (cpaReviewCount > 0) {
      total += PRICING_INFO.addons.cpaReview * cpaReviewCount;
    }
    
    return total;
  }
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
