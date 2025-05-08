
import { useEffect, useState, Suspense } from "react";
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
import { PricingManagement } from "@/components/admin/PricingManagement";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PriceHistoryViewer } from "@/components/admin/PriceHistoryViewer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [routes, setRoutes] = useState<string[]>([]);
  
  // Verify admin status
  useEffect(() => {
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
    
    // Set loading to false - we'll let AdminPageGuard handle auth checks
    setIsLoading(false);
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

  const renderFallback = (message: string) => (
    <div className="p-6 bg-red-100 text-red-800 rounded">
      <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
      <p>{message}</p>
      <p className="mt-2 text-sm">Please check the console for more details or try refreshing the page.</p>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="w-full bg-accent/50 border-b border-border mt-16">
        <div className="container py-3">
          <ErrorBoundary
            fallback={renderFallback("There was an error loading the tabs. Please refresh the page.")}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="firms">Firms</TabsTrigger>
                <TabsTrigger value="demos">Demo Requests</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="priceHistory">Price History</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="webpages">Webpages</TabsTrigger>
              </TabsList>
            </Tabs>
          </ErrorBoundary>
        </div>
      </div>
      
      <AdminPageGuard>
        <main className="flex-1 container py-8">
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
            <ErrorBoundary fallback={renderFallback("Error loading dashboard content")}>
              <Suspense fallback={<div className="p-6 animate-pulse">Loading dashboard data...</div>}>
                <AdminDashboard />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="companies">
            <ErrorBoundary fallback={renderFallback("Error loading companies data")}>
              <div className="space-y-8 max-w-full">
                <CompaniesTable />
                <ZapierWebhookSetup
                  webhookType="companyCreated"
                  description="Receive a webhook trigger when a new company is created."
                />
              </div>
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="firms">
            <ErrorBoundary fallback={renderFallback("Error loading firms data")}>
              <div className="space-y-8 max-w-full">
                <FirmSignupsTable />
                <ZapierWebhookSetup
                  webhookType="firmSignup"
                  description="Receive a webhook trigger when a new firm signs up."
                />
              </div>
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="demos">
            <ErrorBoundary fallback={renderFallback("Error loading demo requests data")}>
              <DemoRequestsTable />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="pricing">
            <ErrorBoundary fallback={renderFallback("Error loading pricing management")}>
              <PricingManagement />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="priceHistory">
            <ErrorBoundary fallback={renderFallback("Error loading price history")}>
              <PriceHistoryViewer />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="contact">
            <ErrorBoundary fallback={renderFallback("Error loading contact data")}>
              <ContactTable />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="webpages">
            <ErrorBoundary fallback={renderFallback("Error loading webpages data")}>
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
            </ErrorBoundary>
          </TabsContent>
        </main>
      </AdminPageGuard>
      
      <Footer />
    </div>
  );
}
