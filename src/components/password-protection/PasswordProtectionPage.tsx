
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const PasswordProtectionPage = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sitePassword, setSitePassword] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Load the site password when component mounts
  useEffect(() => {
    const storedPassword = localStorage.getItem("site_password");
    console.log("Site password found:", storedPassword ? "Yes" : "No");
    setSitePassword(storedPassword);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // First, recheck if protection is still enabled (in case it was disabled in another tab)
      const protectionEnabled = localStorage.getItem("password_protection_enabled") === "true";
      if (!protectionEnabled) {
        console.log("Protection has been disabled, granting access");
        grantAccess();
        return;
      }

      console.log("Validating password...");
      
      if (password === sitePassword) {
        console.log("Password correct, granting access");
        grantAccess();
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
  
  const grantAccess = () => {
    // Set session access with 24 hour expiry
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const currentVersion = localStorage.getItem("session_version") || "0";
    
    const accessData = {
      granted: true,
      expires: expiry,
      version: currentVersion
    };
    
    console.log("Setting access data:", accessData);
    sessionStorage.setItem("site_access", JSON.stringify(accessData));
    
    // Show success toast
    toast({
      title: "Access granted",
      description: "Welcome to the site",
    });

    // Redirect back to the original URL or to the homepage
    const redirectPath = location.state?.from || "/";
    
    // Use window.location.reload() to ensure the page fully refreshes
    // This ensures the PasswordProtection component re-evaluates access
    setTimeout(() => {
      window.location.href = redirectPath;
      // Reload the page after a tiny delay to ensure the sessionStorage is saved
      setTimeout(() => window.location.reload(), 100);
    }, 100);
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
              disabled={isSubmitting || !sitePassword}
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
