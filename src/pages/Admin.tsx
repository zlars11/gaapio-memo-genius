
import { useEffect, useState } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ContactTable } from "@/components/admin/ContactTable";
import { FirmSignupsTable } from "@/components/admin/FirmSignupsTable";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Layout } from "lucide-react";
import { DemoRequestsTable } from "@/components/admin/DemoRequestsTable";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const [routes, setRoutes] = useState<string[]>([]);
  
  // Verify admin status
  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log("Admin.tsx: Checking session");
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (!session) {
          console.log("Admin.tsx: No session found");
          setIsLoading(false);
          return;
        }
        
        console.log("Admin.tsx: Session found, user ID:", session.user.id);
        
        // Check if user has admin role
        const { data: isAdminData, error } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });
        
        console.log("Admin.tsx: Admin check result:", { isAdminData, error });
        
        if (error) {
          console.error("Admin.tsx: Error checking admin status:", error);
          toast({
            title: "Error",
            description: "Could not verify your admin privileges. Please try again.",
            variant: "destructive"
          });
          setIsAdmin(false);
        } else if (!isAdminData) {
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
    
    // Collect all routes from App.tsx
    setRoutes([
      "/",
      "/about-us",
      "/contact",
      "/faq",
      "/blog",
      "/blog/why-technical-accounting-memos-matter",
      "/blog/5-common-asc-606-pitfalls",
      "/blog/how-ai-is-changing-the-accounting-landscape",
      "/ssa",
      "/admin",
      "/admin/users",
      "/signup",
      "/login",
      "/resources",
      "/onepager",
      "/status",
      "/privacy"
    ]);
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

  // Show content regardless of admin status - the AdminPageGuard will handle permissions
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="w-full bg-accent/50 border-b border-border">
        <div className="container py-3">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="firms">Firms</TabsTrigger>
              <TabsTrigger value="demos">Demo Requests</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="webpages">Webpages</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <AdminPageGuard>
        <main className="flex-1 container py-10">
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
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
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
          <TabsContent value="webpages">
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-4">All Website Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {routes.map((route, index) => (
                    <Link 
                      key={index}
                      to={route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <span className="font-medium">{route}</span>
                      <Layout className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </main>
      </AdminPageGuard>
      
      <Footer />
    </div>
  );
}
