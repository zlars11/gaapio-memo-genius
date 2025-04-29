
import { useEffect, useState } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { FirmSignupsTable } from "@/components/admin/FirmSignupsTable";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, RefreshCw } from "lucide-react";
import { DemoRequestsTable } from "@/components/admin/DemoRequestsTable";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [showWaitlistTab, setShowWaitlistTab] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  
  // Load waitlist visibility setting and verify admin status
  useEffect(() => {
    const checkAccess = async () => {
      // Load saved setting for waitlist tab visibility
      const showWaitlist = localStorage.getItem("showWaitlistToUsers");
      setShowWaitlistTab(showWaitlist === null ? true : showWaitlist === "true");
      
      // Add explicit check for admin status
      try {
        console.log("Admin.tsx: Checking session");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("Admin.tsx: No session found");
          setIsLoading(false);
          return;
        }
        
        console.log("Admin.tsx: Session found, user ID:", session.user.id);
        console.log("Admin.tsx: Checking admin role with parameters:", {
          user_id: session.user.id,
          role: 'admin'
        });
        
        const { data, error } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });
        
        console.log("Admin.tsx: Admin check result:", { data, error });
        
        if (error) {
          console.error("Admin.tsx: Error checking admin status:", error);
          toast({
            title: "Error",
            description: "Could not verify your admin privileges. Please try again.",
            variant: "destructive"
          });
          setIsAdmin(false);
        } else if (!data) {
          console.log("Admin.tsx: User is not an admin");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
          });
          setIsAdmin(false);
        } else {
          console.log("Admin.tsx: User is confirmed as admin");
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Admin.tsx: Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [toast]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading admin panel...</span>
      </div>
    );
  }

  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Portal</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Manage Admin Users
              </Link>
            </Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {showWaitlistTab && <TabsTrigger value="waitlist">Waitlist</TabsTrigger>}
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="firms">Firms</TabsTrigger>
            <TabsTrigger value="demos">Demo Requests</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          {showWaitlistTab && (
            <TabsContent value="waitlist">
              <WaitlistTable />
            </TabsContent>
          )}
          <TabsContent value="companies">
            <div className="space-y-8 max-w-full">
              <CompaniesTable />
              <ZapierWebhookSetup
                webhookType="companyCreated"
                description="Receive a webhook trigger when a new company is created."
              />
            </div>
          </TabsContent>
          <TabsContent value="firms">
            <div className="space-y-8 max-w-full">
              <FirmSignupsTable />
              <ZapierWebhookSetup
                webhookType="firmSignup"
                description="Receive a webhook trigger when a new firm signs up."
              />
            </div>
          </TabsContent>
          <TabsContent value="demos">
            <DemoRequestsTable />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageGuard>
  );
}
