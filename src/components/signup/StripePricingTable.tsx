
import { useEffect } from "react";

interface StripePricingTableProps {
  pricingTableId: string;
}

export function StripePricingTable({ pricingTableId }: StripePricingTableProps) {
  const publishableKey = "pk_test_51RKAy0Qx8kjcVg7rznYCuyOCUMvaIzYUPNF9FNlASoI1CgpYydWWFlEjT4GmHKWAQHeeYeNOpFq68CPjW4ONJsCQ00MjcVPJxc";

  useEffect(() => {
    // Load Stripe.js script
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    
    // Check if script already exists to prevent duplicate loading
    if (!document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]')) {
      document.body.appendChild(script);
    }
    
    return () => {
      // Optional: Remove script when component unmounts
      // This is typically not necessary
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
