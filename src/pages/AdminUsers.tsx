
import { useState } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus, ArrowLeft } from "lucide-react";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminSecurityAlert } from "@/components/admin/AdminSecurityAlert";
import { AdminFetchErrorAlert } from "@/components/admin/AdminFetchErrorAlert";
import { AddAdminDialog } from "@/components/admin/AddAdminDialog";
import { AdminNameDialog } from "@/components/admin/AdminNameDialog";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Header } from "@/components/header";

export default function AdminUsers() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    loading, 
    admins, 
    removing, 
    currentUserIsAdmin, 
    currentUserDisplayed,
    fetchError,
    currentUserEmail,
    currentUserId,
    updatingName,
    nameDialogOpen,
    setNameDialogOpen,
    handleRemoveAdmin,
    handleFixCurrentUserAdmin,
    handleUpdateName,
    fetchAdmins
  } = useAdminUsers();

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    toast({
      title: "Refreshing admin list",
      description: "Fetching the latest admin users data...",
    });
    
    fetchAdmins().catch(error => {
      console.error("Error refreshing admin list:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh admin users list. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <AdminPageGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-6xl mx-auto py-8 mt-16">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Portal
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin User Management</h1>
          </div>
          
          {currentUserIsAdmin && !currentUserDisplayed && (
            <AdminSecurityAlert 
              currentUserEmail={currentUserEmail} 
              onFixStatus={handleFixCurrentUserAdmin} 
            />
          )}
          
          {fetchError && (
            <AdminFetchErrorAlert 
              error={fetchError} 
              onRetry={fetchAdmins}
              loading={loading}
            />
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>
                  Manage users with access to the admin portal
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefreshClick} 
                  title="Refresh admin list"
                  disabled={loading}
                  aria-label="Refresh admin list"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh</span>
                </Button>
                <Button 
                  onClick={handleOpenAddDialog}
                  disabled={loading}
                  aria-label="Add new admin user"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AdminUsersTable 
                loading={loading} 
                admins={admins} 
                removing={removing}
                currentUserId={currentUserId}
                onRemoveAdmin={handleRemoveAdmin}
                onUpdateName={() => setNameDialogOpen(true)}
              />
            </CardContent>
          </Card>
        </div>

        <AddAdminDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen} 
          onSuccess={fetchAdmins}
        />

        <AdminNameDialog
          open={nameDialogOpen}
          onOpenChange={setNameDialogOpen}
          onSave={handleUpdateName}
          isLoading={updatingName}
        />
      </div>
    </AdminPageGuard>
  );
}
