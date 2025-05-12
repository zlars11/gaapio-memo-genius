
import { useEffect } from "react";

interface StripePricingTableProps {
  pricingTableId: string;
}

export function StripePricingTable({ pricingTableId }: StripePricingTableProps) {
  const publishableKey = "pk_test_51RKAy0Qx8kjcVg7rznYCuyOCUMvaIzYUPNF9FNlASoI1CgpYydWWFlEjT4GmHKWAQHeeYeNOpFq68CPjW4ONJsCQ00MjcVPJxc";

  useEffect(() => {
    // Load Stripe.js script only once globally
    if (!document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/pricing-table.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Apply custom CSS to make Stripe pricing tables appear side by side
    const styleId = "stripe-pricing-table-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        stripe-pricing-table {
          --price-table-layout: row !important;
          width: 100% !important;
        }
        
        .stripe-pricing-container {
          min-width: 768px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          overflow-x: auto;
        }
        
        @media (max-width: 768px) {
          .stripe-pricing-container {
            min-width: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Script cleanup is handled by the check above to prevent duplicates
    };
  }, []);

  return (
    <div className="stripe-pricing-container">
      {pricingTableId && (
        <stripe-pricing-table
          pricing-table-id={pricingTableId}
          publishable-key={publishableKey}
        ></stripe-pricing-table>
      )}
    </div>
  );
}
