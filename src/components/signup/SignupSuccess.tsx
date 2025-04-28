
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SignUpSummary } from "@/pages/SignUpSummary";
import { getPlanLabel } from "@/constants/planConfig";

interface SignupSuccessProps {
  showFirmContact: boolean;
  userInfo: any;
  paymentInfo: any;
  selectedPlan: string;
  onHomeClick: () => void;
}

export const SignupSuccess = ({
  showFirmContact,
  userInfo,
  paymentInfo,
  selectedPlan,
  onHomeClick
}: SignupSuccessProps) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Submission!</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {showFirmContact
          ? "Our team will contact you soon to discuss your firm's needs."
          : "We've sent a confirmation email with your account details. You'll be able to access your account shortly."
        }
      </p>
      {!showFirmContact && (
        <div className="mb-8">
          <Card className="inline-block bg-muted/40 text-left">
            <CardHeader>
              <CardTitle className="text-lg">Your Submitted Info</CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo && (
                <SignUpSummary 
                  userInfo={userInfo} 
                  paymentInfo={paymentInfo} 
                  ANNUAL_LABEL={getPlanLabel(selectedPlan)} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <Button onClick={onHomeClick} size="lg">
        Return to Homepage
      </Button>
    </div>
  );
};
