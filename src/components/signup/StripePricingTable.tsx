
// Add JSX declaration for custom element
declare namespace JSX {
  interface IntrinsicElements {
    'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'pricing-table-id': string;
      'publishable-key': string;
    }, HTMLElement>;
  }
}

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
