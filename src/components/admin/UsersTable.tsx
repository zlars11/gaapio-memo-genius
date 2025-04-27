
import { useState } from "react";
import { Table, TableCaption } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { User } from "./types/userTypes";
import { UserSignupsSearch } from "./UserSignupsSearch";
import { UsersTableContent } from "./UsersTableContent";
import { useUserSignups } from "@/hooks/useUserSignups";
import EditUserDialog from "./EditUserDialog";
import { supabase } from "@/integrations/supabase/client";

export function UserSignupsTable() {
  const { filteredUsers, loading, searchQuery, setSearchQuery, refreshUsers } = useUserSignups();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    currentItems: paginatedUsers,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage
  } = usePagination({
    items: filteredUsers,
    initialItemsPerPage: 10
  });

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setDialogOpen(false);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          status: updatedUser.status
        })
        .eq("id", updatedUser.id);
      
      if (error) throw error;
      
      await refreshUsers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      await refreshUsers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Sign-ups</CardTitle>
        <CardDescription>
          Users who have subscribed to a paid plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserSignupsSearch value={searchQuery} onChange={setSearchQuery} />
        
        <Table>
          <TableCaption>A list of users who have signed up.</TableCaption>
          <UsersTableContent
            loading={loading}
            items={paginatedUsers}
            onEdit={handleOpenEdit}
            searchQuery={searchQuery}
          />
        </Table>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {editUser && (
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <EditUserDialog
                user={editUser}
                onSave={handleSaveUser}
                onDelete={() => handleDeleteUser(editUser.id)}
                onClose={handleCloseEdit}
              />
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
}
