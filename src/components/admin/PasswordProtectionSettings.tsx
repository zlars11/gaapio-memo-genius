
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getProtectionStatus, setProtectionStatus, getSitePassword, setSitePassword, expireAllSessions } from "@/utils/securityUtils";

export function PasswordProtectionSettings() {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const { toast } = useToast();
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      const protectionEnabled = getProtectionStatus();
      console.log("Admin: Loading protection settings, enabled:", protectionEnabled);
      setIsProtectionEnabled(protectionEnabled);
      
      const storedPassword = getSitePassword();
      if (storedPassword) {
        setPassword(storedPassword);
      } else {
        // Default password
        const defaultPassword = "Gaapio2025!";
        setPassword(defaultPassword);
        setSitePassword(defaultPassword);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle protection toggle
  const handleToggleProtection = async (checked: boolean) => {
    setIsSaving(true);
    
    try {
      setProtectionStatus(checked);
      setIsProtectionEnabled(checked);
      
      // Force version change to invalidate existing sessions if protection is being enabled
      if (checked) {
        await handleExpireSessions();
      }
      
      toast({
        title: `Password Protection ${checked ? "Enabled" : "Disabled"}`,
        description: checked 
          ? "The site is now password protected" 
          : "The site is now publicly accessible",
      });
    } catch (error) {
      console.error("Error toggling protection:", error);
      toast({
        title: "Error",
        description: "Failed to update protection setting",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save password
  const handleSavePassword = () => {
    setIsSaving(true);
    
    try {
      if (password.length < 4) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 4 characters long",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      setSitePassword(password);
      
      // Also expire all sessions when password is changed
      handleExpireSessions();
      
      toast({
        title: "Password Updated",
        description: "The site password has been updated",
      });
    } catch (error) {
      console.error("Error saving password:", error);
      toast({
        title: "Error",
        description: "Failed to save password",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Expire all sessions
  const handleExpireSessions = async () => {
    setIsExpiring(true);
    
    try {
      expireAllSessions();
      
      toast({
        title: "Sessions Expired",
        description: "All user sessions have been expired",
      });
      
      return true;
    } catch (error) {
      console.error("Error expiring sessions:", error);
      toast({
        title: "Error",
        description: "Failed to expire sessions",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsExpiring(false);
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
            disabled={isSaving}
          />
          <Label htmlFor="password-protection">
            {isSaving ? "Updating..." : "Enable password protection"}
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
                disabled={!isProtectionEnabled || isSaving}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={!isProtectionEnabled || isSaving}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button 
              onClick={handleSavePassword}
              className="ml-2"
              disabled={!isProtectionEnabled || password.length < 4 || isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
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
            disabled={!isProtectionEnabled || isExpiring}
          >
            {isExpiring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Expiring Sessions...
              </>
            ) : (
              "Expire All Sessions"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Forces all users to re-enter the password
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
