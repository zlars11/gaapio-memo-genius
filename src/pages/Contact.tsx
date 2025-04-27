
import { ContactForm } from "@/components/contact/ContactForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFirmSignupSubmit = async (data: any) => {
    try {
      // First, try to create the company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: data.company,
          plan: "firms",
          status: "active",
          amount: 0
        })
        .select()
        .single();

      if (companyError) {
        if (companyError.code === '23505') { // Unique violation
          toast({
            title: "Company already exists",
            description: "This company is already registered in our system.",
            variant: "destructive"
          });
          return;
        }
        throw companyError;
      }

      // Then create the user record
      const { error: userError } = await supabase
        .from("users")
        .insert({
          first_name: data.firstname,
          last_name: data.lastname,
          email: data.email,
          phone: data.phone || "",
          company_id: companyData.id,
          user_type: "user",
          status: "active"
        });

      if (userError) throw userError;
      
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Your information has been submitted successfully.",
      });
    } catch (error: any) {
      console.error("Error submitting firm data:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
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
