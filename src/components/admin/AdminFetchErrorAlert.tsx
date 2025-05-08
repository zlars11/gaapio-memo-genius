
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminFetchErrorAlertProps {
  error: string | null;
  onRetry: () => void;
  loading?: boolean;
}

export function AdminFetchErrorAlert({ error, onRetry, loading }: AdminFetchErrorAlertProps) {
  // If no error, don't render anything
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading admin users</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit mt-2"
          onClick={onRetry}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
