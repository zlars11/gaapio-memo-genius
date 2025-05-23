
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { FirmContactForm } from "@/components/signup/FirmContactForm";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { SignupSuccess } from "@/components/signup/SignupSuccess";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FirmSignup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  const handleFormSuccess = (data: any) => {
    setFormData(data);
    setSubmitted(true);
    
    toast({
      title: "Form Submitted",
      description: "Thanks for your interest! Our team will be in touch with you shortly.",
    });
  };
  
  const handleHomeClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/signup");
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer>
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">CPA Firm Signup</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get in touch with our team to learn more about our special offerings for accounting firms.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <FirmContactForm onSuccess={handleFormSuccess} />
                
                <div className="mt-6">
                  <Button variant="outline" onClick={handleBackClick}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Signup
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <SignupSuccess
                showFirmContact={true}
                userInfo={formData}
                paymentInfo={null}
                selectedPlan="firms"
                onHomeClick={handleHomeClick}
              />
              
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={handleBackClick}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Signup
                </Button>
              </div>
            </>
          )}
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
