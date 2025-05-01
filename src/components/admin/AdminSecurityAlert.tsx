
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface AdminSecurityAlertProps {
  currentUserEmail: string | null;
  onFixStatus: () => Promise<boolean>;
}

export function AdminSecurityAlert({ currentUserEmail, onFixStatus }: AdminSecurityAlertProps) {
  const [isFixing, setIsFixing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFixStatus = async () => {
    try {
      setIsFixing(true);
      setErrorMessage(null);
      const result = await onFixStatus();
      
      if (result) {
        setSuccess(true);
      } else {
        setErrorMessage("Failed to update admin status. Please try again.");
      }
    } catch (error: any) {
      console.error("Error fixing admin status:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsFixing(false);
    }
  };

  // If the fix was successful, don't show the alert anymore
  if (success) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Admin Status Issue</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          You have admin access but aren't listed in the admin users table.
          {currentUserEmail && ` Your email (${currentUserEmail}) should appear in the list.`}
        </p>
        
        {errorMessage && (
          <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
        )}
        
        <Button
          onClick={handleFixStatus}
          disabled={isFixing}
          variant="outline"
          className="mt-2"
          size="sm"
        >
          {isFixing ? "Fixing..." : "Fix Now"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
