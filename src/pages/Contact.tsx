
import { ContactForm } from "@/components/contact/ContactForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFirmSignupSubmit = async (data: any) => {
    try {
      // Add type field to identify this as a firm signup
      const firmData = {
        ...data,
        type: "firm",
        // Format the company name for consistency
        company: data.company || data["Firm Name"],
      };

      // Check that we have the minimum required fields
      if (!firmData.email || !firmData.company) {
        throw new Error("Missing required fields");
      }

      const { error } = await supabase
        .from("user_signups")
        .insert([
          {
            firstname: firmData.firstname || "",
            lastname: firmData.lastname || "",
            email: firmData.email,
            phone: firmData.phone || "",
            company: firmData.company,
            notes: firmData.message || firmData.notes || "",
            plan: "enterprise", // Default plan for firms
            type: "firm",
            status: "lead" // Set status as lead for new firm signups
          }
        ]);

      if (error) throw error;
      
      // Show success message
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting firm data:", error);
    }
  };

  return (
    <div className="py-16 min-h-screen">
      <ResponsiveContainer className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Have questions or want to learn more about our platform? Contact us using the form below
          and a member of our team will get back to you as soon as possible.
        </p>
        
        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
            <p className="text-green-700">
              Your submission has been received. A representative will reach out to you shortly.
            </p>
          </div>
        ) : (
          <div className="bg-white border rounded-lg p-8 shadow-sm">
            <ContactForm onSubmitSuccess={handleFirmSignupSubmit} />
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}
