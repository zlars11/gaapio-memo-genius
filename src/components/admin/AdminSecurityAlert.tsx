
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AdminSecurityAlertProps {
  currentUserEmail: string | null;
  onFixStatus: () => void;
}

export function AdminSecurityAlert({ currentUserEmail, onFixStatus }: AdminSecurityAlertProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Security Issue Detected</AlertTitle>
      <AlertDescription>
        You have admin access ({currentUserEmail}) but aren't listed in the admin users table. This is a security risk.
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-4" 
          onClick={onFixStatus}
        >
          Fix My Admin Status
        </Button>
      </AlertDescription>
    </Alert>
  );
}
