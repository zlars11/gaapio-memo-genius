
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AdminFetchErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export function AdminFetchErrorAlert({ error, onRetry }: AdminFetchErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Loading Admin Users</AlertTitle>
      <AlertDescription>
        {error}
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-4" 
          onClick={onRetry}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
