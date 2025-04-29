
import { useState } from "react";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from "lucide-react";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminSecurityAlert } from "@/components/admin/AdminSecurityAlert";
import { AdminFetchErrorAlert } from "@/components/admin/AdminFetchErrorAlert";
import { AddAdminDialog } from "@/components/admin/AddAdminDialog";
import { AdminNameDialog } from "@/components/admin/AdminNameDialog";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function AdminUsers() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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

  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin User Management</h1>
        
        {currentUserIsAdmin && !currentUserDisplayed && (
          <AdminSecurityAlert 
            currentUserEmail={currentUserEmail} 
            onFixStatus={handleFixCurrentUserAdmin} 
          />
        )}
        
        {fetchError && (
          <AdminFetchErrorAlert error={fetchError} onRetry={fetchAdmins} />
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
                onClick={fetchAdmins} 
                title="Refresh admin list"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={() => setAddDialogOpen(true)}
                disabled={loading}
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
    </AdminPageGuard>
  );
}
