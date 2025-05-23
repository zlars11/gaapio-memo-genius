
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { validateSitePassword } from "@/utils/securityUtils";

export const PasswordProtectionPage = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const isValid = await validateSitePassword(password);
      
      if (isValid) {
        toast({
          title: "Access granted",
          description: "Welcome to the site",
        });

        // Redirect back to the original URL or to the homepage
        const redirectPath = location.state?.from || "/";
        
        // Use window.location.href to ensure the page fully refreshes
        // This ensures the cookies are properly evaluated on the next page load
        window.location.href = redirectPath;
        
        // If for some reason the redirect doesn't trigger, force a reload
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        console.log("Incorrect password provided");
        setError("Incorrect password");
        toast({
          title: "Access denied",
          description: "The password you entered is incorrect",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error validating password:", err);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
            Password Protected
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
            Please enter the password to access this site
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtectionPage;
