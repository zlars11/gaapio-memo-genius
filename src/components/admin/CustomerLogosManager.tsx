import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCustomerLogos, useUpdateCustomerLogo, useDeleteCustomerLogo, CustomerLogo } from "@/hooks/useCustomerLogos";
import { CustomerLogoDialog } from "./CustomerLogoDialog";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export function CustomerLogosManager() {
  const { data: logos, isLoading } = useCustomerLogos();
  const updateMutation = useUpdateCustomerLogo();
  const deleteMutation = useDeleteCustomerLogo();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<CustomerLogo | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState<CustomerLogo | null>(null);

  const handleEdit = (logo: CustomerLogo) => {
    setEditingLogo(logo);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingLogo(undefined);
    setDialogOpen(true);
  };

  const handleToggleActive = async (logo: CustomerLogo) => {
    await updateMutation.mutateAsync({
      id: logo.id,
      updates: { is_active: !logo.is_active },
    });
  };

  const handleDeleteClick = (logo: CustomerLogo) => {
    setLogoToDelete(logo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (logoToDelete) {
      await deleteMutation.mutateAsync(logoToDelete);
      setDeleteDialogOpen(false);
      setLogoToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Logos</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Logos</CardTitle>
              <CardDescription>
                Manage customer logos displayed in the "Trusted by" section on the homepage
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Logo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!logos || logos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No customer logos yet</p>
              <p className="text-sm mb-4">Add your first customer logo to get started</p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Logo
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead className="text-center">Display Order</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logos.map((logo) => (
                  <TableRow key={logo.id}>
                    <TableCell>
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={logo.logo_url}
                          alt={logo.company_name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{logo.company_name}</TableCell>
                    <TableCell className="text-center">{logo.display_order}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={logo.is_active}
                        onCheckedChange={() => handleToggleActive(logo)}
                        disabled={updateMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(logo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(logo)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CustomerLogoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        logo={editingLogo}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer Logo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the logo for "{logoToDelete?.company_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
