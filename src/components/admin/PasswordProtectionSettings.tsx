
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

export function PasswordProtectionSettings() {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  // Load settings on component mount
  useEffect(() => {
    try {
      const protectionEnabled = localStorage.getItem("password_protection_enabled") === "true";
      setIsProtectionEnabled(protectionEnabled);
      
      const storedPassword = localStorage.getItem("site_password");
      if (storedPassword) {
        setPassword(storedPassword);
      } else {
        // Get default password from environment variable
        try {
          const defaultPassword = import.meta.env.VITE_SITE_PASSWORD || "";
          setPassword(defaultPassword);
          localStorage.setItem("site_password", defaultPassword);
        } catch (error) {
          console.error("Error accessing environment variable:", error);
          setPassword("");
          localStorage.setItem("site_password", "");
        }
      }
    } catch (error) {
      console.error("Error loading password protection settings:", error);
      // Set default values if there's an error
      setIsProtectionEnabled(false);
      setPassword("");
    }
  }, []);
  
  // Handle protection toggle
  const handleToggleProtection = (checked: boolean) => {
    try {
      setIsProtectionEnabled(checked);
      localStorage.setItem("password_protection_enabled", checked.toString());
      
      toast({
        title: `Password Protection ${checked ? "Enabled" : "Disabled"}`,
        description: checked 
          ? "The site is now password protected" 
          : "The site is now publicly accessible",
      });
    } catch (error) {
      console.error("Error toggling password protection:", error);
      toast({
        title: "Error",
        description: "Failed to update password protection settings",
        variant: "destructive",
      });
    }
  };
  
  // Save password
  const handleSavePassword = () => {
    try {
      if (password.length < 4) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 4 characters long",
          variant: "destructive",
        });
        return;
      }
      
      localStorage.setItem("site_password", password);
      toast({
        title: "Password Updated",
        description: "The site password has been updated",
      });
    } catch (error) {
      console.error("Error saving password:", error);
      toast({
        title: "Error",
        description: "Failed to save the password",
        variant: "destructive",
      });
    }
  };
  
  // Expire all sessions
  const handleExpireSessions = () => {
    try {
      // Update the version number to invalidate all current sessions
      const currentVersion = parseInt(localStorage.getItem("session_version") || "0");
      localStorage.setItem("session_version", (currentVersion + 1).toString());
      
      toast({
        title: "Sessions Expired",
        description: "All user sessions have been expired",
      });
    } catch (error) {
      console.error("Error expiring sessions:", error);
      toast({
        title: "Error",
        description: "Failed to expire sessions",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Protection</CardTitle>
        <CardDescription>
          Control access to the public site with password protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="password-protection"
            checked={isProtectionEnabled}
            onCheckedChange={handleToggleProtection}
          />
          <Label htmlFor="password-protection">
            Enable password protection
          </Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-password">Site Password</Label>
          <div className="flex">
            <div className="relative flex-grow">
              <Input
                id="site-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter site password"
                className="pr-10"
                disabled={!isProtectionEnabled}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={!isProtectionEnabled}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button 
              onClick={handleSavePassword}
              className="ml-2"
              disabled={!isProtectionEnabled || password.length < 4}
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Password must be at least 4 characters long
          </p>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleExpireSessions}
            disabled={!isProtectionEnabled}
          >
            Expire All Sessions
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Forces all users to re-enter the password
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
