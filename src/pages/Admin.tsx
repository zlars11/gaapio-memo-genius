
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { UserSignupsTable } from "@/components/admin/UsersTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { DemoRequestsTable } from "@/components/admin/DemoRequestsTable";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminSecurityAlert } from "@/components/admin/AdminSecurityAlert";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
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
        {currentUser.isAdmin && !currentUser.displayedInList && (
          <AdminSecurityAlert 
            currentUserEmail={currentUser.email} 
            onFixStatus={handleFixAdminStatus} 
          />
        )}
        
        <ResponsiveContainer className="py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>
          
          <AdminFetchErrorAlert 
            error={userError || adminsError}
            onRetry={fetchAdmins}
          />
          
          <ErrorBoundary
            fallback={renderFallback("There was an error loading the tabs. Please refresh the page.")}
          >
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
                <TabsTrigger value="contacts">Contact</TabsTrigger>
                <TabsTrigger value="demos">Demo Requests</TabsTrigger>
                <TabsTrigger value="firms">Firm Signups</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
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
              
              <TabsContent value="waitlist" className="space-y-4">
                <WaitlistTable />
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
                          {admin.user_id === currentUser.id && !currentUser.first_name && (
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
            onSave={(firstName, lastName, email) => handleUpdateName(firstName, lastName, email)}
            isLoading={false}
          />
        )}
      </div>
    </AdminPageGuard>
  );

  async function handleUpdateName(firstName: string, lastName: string, email: string): Promise<boolean> {
    // Implementation for updating admin name
    console.log("Updating admin name:", firstName, lastName, email);
    // After successful update, refresh admin list
    await fetchAdmins();
    return true;
  }
}
