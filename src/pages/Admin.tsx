
import { useEffect, useState } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { UserSignupsTable } from "@/components/admin/UserSignupsTable";
import { FirmSignupsTable } from "@/components/admin/FirmSignupsTable";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const [showWaitlistTab, setShowWaitlistTab] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load waitlist visibility setting and verify admin status
  useEffect(() => {
    const checkAccess = async () => {
      // Load saved setting for waitlist tab visibility
      const showWaitlist = localStorage.getItem("showWaitlistToUsers");
      setShowWaitlistTab(showWaitlist === null ? true : showWaitlist === "true");
      
      // Add explicit check for admin status
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("Admin.tsx: No session found");
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });
        
        console.log("Admin.tsx: Admin check result:", { data, error });
        
        if (error || !data) {
          console.error("Admin.tsx: Access denied or error:", error);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Admin.tsx: Error checking admin status:", error);
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
        <div className="animate-pulse">Initializing admin panel...</div>
      </div>
    );
  }

  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Portal</h1>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {showWaitlistTab && <TabsTrigger value="waitlist">Waitlist</TabsTrigger>}
            <TabsTrigger value="user-signups">User Sign-ups</TabsTrigger>
            <TabsTrigger value="firm-signups">Firm Sign-ups</TabsTrigger>
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
          <TabsContent value="user-signups">
            <div className="space-y-8 max-w-full">
              <UserSignupsTable />
              <ZapierWebhookSetup
                webhookType="userSignup"
                description="Receive a webhook trigger when a new user subscribes via the signup form."
              />
            </div>
          </TabsContent>
          <TabsContent value="firm-signups">
            <div className="space-y-8 max-w-full">
              <FirmSignupsTable />
              <ZapierWebhookSetup
                webhookType="firmSignup"
                description="Receive a webhook trigger when a new firm signs up."
              />
            </div>
          </TabsContent>
          <TabsContent value="contact">
            <ContactTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageGuard>
  );
}
