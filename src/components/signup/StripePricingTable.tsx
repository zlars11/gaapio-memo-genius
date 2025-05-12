
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
          --price-table-spacing-unit: 1rem !important;
          --price-table-container-width: 100% !important;
          --price-table-layout-column-count: 3 !important;
          width: 100% !important;
        }
        stripe-pricing-table .priceTable, 
        stripe-pricing-table .priceTableWrapper,
        stripe-pricing-table .priceTableContainer {
          width: 100% !important;
          max-width: 100% !important;
        }
        stripe-pricing-table .priceTable {
          border: 1px solid var(--stripe-pricing-table-border-color, rgba(0, 0, 0, 0.1)) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          margin: 0 8px 16px 8px !important;
        }
        @media (max-width: 768px) {
          stripe-pricing-table {
            --price-table-layout: column !important;
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
    <div className="w-full max-w-4xl mx-auto transition-all duration-300 ease-in-out">
      {pricingTableId && (
        <stripe-pricing-table
          pricing-table-id={pricingTableId}
          publishable-key={publishableKey}
        ></stripe-pricing-table>
      )}
    </div>
  );
}
