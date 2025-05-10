import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { UserSignupsTable } from "@/components/admin/UsersTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { DemoRequestsTable } from "@/components/admin/DemoRequestsTable";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminSecurityAlert } from "@/components/admin/AdminSecurityAlert";
import { PricingManagement } from "@/components/admin/PricingManagement";
import { FirmSignupsTable } from "@/components/admin/FirmSignupsTable";
import { AdminFetchErrorAlert } from "@/components/admin/AdminFetchErrorAlert";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";
import { FeatureToggles } from "@/components/admin/FeatureToggles";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useFetchAdmins } from "@/hooks/useFetchAdmins";
import { Button } from "@/components/ui/button";
import { AddAdminDialog } from "@/components/admin/AddAdminDialog";
import { AdminNameDialog } from "@/components/admin/AdminNameDialog";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ExternalLink, FileEdit } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { 
    currentUser, 
    loading: userLoading, 
    error: userError,
    fixAdminStatus,
    fetchCurrentUserInfo 
  } = useCurrentAdmin();
  
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  
  const { 
    admins, 
    loading: adminsLoading, 
    error: adminsError,
    fetchAdmins
  } = useFetchAdmins(currentUser);

  // Updated list of pages to display in the webpages tab - only real pages
  const websitePages = [
    { title: "Home Page", path: "/", description: "Main landing page" },
    { title: "About Us", path: "/about-us", description: "Company information page" },
    { title: "Contact", path: "/contact", description: "Contact form and information" },
    { title: "FAQ", path: "/faq", description: "Frequently asked questions" },
    { title: "Resources", path: "/resources", description: "Blog and resource content" },
    { title: "Blog", path: "/blog", description: "Blog articles and posts" },
    { title: "Login", path: "/login", description: "User login page" },
    { title: "Sign Up", path: "/signup", description: "User registration flow" },
    { title: "Firm Signup", path: "/firm-signup", description: "CPA firm signup page" },
    { title: "Request Demo", path: "/request-demo", description: "Demo request page" },
    { title: "Pricing", path: "/pricing", description: "Pricing plans and options" },
    { title: "Privacy", path: "/privacy", description: "Privacy policy page" },
    { title: "Subscription Agreement", path: "/ssa", description: "Subscription service agreement" },
    { title: "Success", path: "/success", description: "Payment success page" },
    { title: "Cancel", path: "/cancel", description: "Payment cancellation page" }
  ];

  // Set the active tab from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  const renderFallback = (message: string) => (
    <div className="p-8 text-center">
      <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
      <p className="text-muted-foreground">{message}</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </Button>
    </div>
  );

  const handleFixAdminStatus = async () => {
    return await fixAdminStatus();
  };

  return (
    <AdminPageGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        {currentUser.isAdmin && !currentUser.displayedInList && (
          <AdminSecurityAlert 
            currentUserEmail={currentUser.email} 
            onFixStatus={handleFixAdminStatus} 
          />
        )}
        
        <ResponsiveContainer className="py-10 mt-16">
          <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>
          
          <AdminFetchErrorAlert 
            error={userError || adminsError}
            onRetry={fetchAdmins}
            loading={adminsLoading}
          />
          
          <ErrorBoundary
            fallback={renderFallback("There was an error loading the tabs. Please refresh the page.")}
          >
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="contacts">Contact</TabsTrigger>
                <TabsTrigger value="demos">Demo Requests</TabsTrigger>
                <TabsTrigger value="firms">Firm Signups</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="webpages">Webpages</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="border rounded-md mt-6 bg-card">
                <AdminDashboard />
              </TabsContent>
              
              <TabsContent value="companies" className="space-y-4">
                <CompaniesTable />
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <UserSignupsTable />
              </TabsContent>
              
              <TabsContent value="contacts" className="space-y-4">
                <ContactTable />
              </TabsContent>
              
              <TabsContent value="demos" className="space-y-4">
                <DemoRequestsTable />
              </TabsContent>
              
              <TabsContent value="firms" className="space-y-4">
                <FirmSignupsTable />
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <PricingManagement />
              </TabsContent>
              
              <TabsContent value="webpages" className="space-y-4">
                <div className="p-6 border rounded-md bg-card">
                  <h2 className="text-2xl font-semibold mb-4">Website Pages Management</h2>
                  <p className="text-muted-foreground mb-6">Manage website pages content and SEO settings</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {websitePages.map((page) => (
                      <Card key={page.path} className="overflow-hidden">
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{page.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{page.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Link 
                              to={page.path} 
                              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Page
                            </Link>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <FileEdit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center py-8 mt-4">
                    <p className="text-muted-foreground">Full page editor coming soon.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-8">
                <div className="border rounded-md p-6 bg-card">
                  <h2 className="text-2xl font-semibold mb-6">Admin Users</h2>
                  <div className="mb-6">
                    <Button onClick={() => setShowAddAdminDialog(true)}>
                      Add Admin User
                    </Button>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Current Admins</h3>
                  <div className="space-y-4">
                    {admins.map(admin => (
                      <div 
                        key={admin.id} 
                        className="flex justify-between items-center p-4 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {admin.first_name || admin.last_name ? 
                              `${admin.first_name || ''} ${admin.last_name || ''}` : 
                              'Unnamed Admin'}
                          </p>
                          <p className="text-muted-foreground text-sm">{admin.email}</p>
                          <p className="text-xs text-muted-foreground">Role: {admin.role}</p>
                        </div>
                        <div>
                          {admin.user_id === currentUser.id && (!currentUser.first_name && !currentUser.last_name) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowNameDialog(true)}
                            >
                              Set Your Name
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {!adminsLoading && admins.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground">
                        No admin users found
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md p-6 bg-card">
                  <h2 className="text-2xl font-semibold mb-6">Integrations</h2>
                  <ZapierWebhookSetup 
                    webhookType="zapier" 
                    description="Connect Zapier to receive notifications when users submit forms" 
                  />
                </div>
                
                <div className="border rounded-md p-6 bg-card">
                  <h2 className="text-2xl font-semibold mb-6">Feature Toggles</h2>
                  <FeatureToggles />
                </div>
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        </ResponsiveContainer>
        
        {showAddAdminDialog && (
          <AddAdminDialog
            open={showAddAdminDialog}
            onOpenChange={setShowAddAdminDialog}
            onSuccess={fetchAdmins}
          />
        )}
        
        {showNameDialog && (
          <AdminNameDialog
            open={showNameDialog}
            onOpenChange={setShowNameDialog}
            onSave={handleUpdateName}
            isLoading={false}
          />
        )}
      </div>
    </AdminPageGuard>
  );

  async function handleUpdateName(firstName: string, lastName: string): Promise<boolean> {
    // Implementation for updating admin name
    console.log("Updating admin name:", firstName, lastName);
    if (!currentUser.email) return false;
    
    // After successful update, refresh admin list
    await fetchAdmins();
    return true;
  }
}
