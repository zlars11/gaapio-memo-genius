
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DemoRequestSuccess() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Request!</h1>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We've received your demo request and our team will be in touch with you shortly 
        to schedule a personalized demonstration.
      </p>
      
      <Button 
        onClick={() => navigate("/")} 
        size="lg"
      >
        Return to Homepage
      </Button>
    </div>
  );
}
