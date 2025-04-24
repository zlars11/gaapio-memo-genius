
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { EditFirmDialog } from "./EditFirmDialog";
import { FirmSignupRow } from "./FirmSignupRow";
import { FirmSignup } from "./types/userTypes";

export function FirmSignupsTable() {
  const [firmSignups, setFirmSignups] = useState<FirmSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFirm, setEditingFirm] = useState<FirmSignup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FirmSignup>>({});
  const { toast } = useToast();

  const {
    currentItems: paginatedFirmSignups,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage
  } = usePagination({
    items: firmSignups,
    initialItemsPerPage: 10
  });

  useEffect(() => {
    fetchFirmSignups();
  }, []);

  async function fetchFirmSignups() {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_signups")
      .select("*")
      .eq("type", "firm")
      .order("signupdate", { ascending: false });

    if (error) {
      console.error("Error fetching firm signups:", error);
      toast({
        title: "Error",
        description: "Failed to fetch firm signups",
        variant: "destructive",
      });
      setFirmSignups([]);
    } else {
      console.log("Fetched firm signups:", data);
      setFirmSignups(data || []);
    }
    setLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFirm = (firm: FirmSignup) => {
    setEditingFirm(firm);
    setFormData({
      company: firm.company,
      firstname: firm.firstname,
      lastname: firm.lastname,
      email: firm.email,
      phone: firm.phone,
      notes: firm.notes,
      cardNumber: firm.cardNumber,
      expDate: firm.expDate,
      cvv: firm.cvv,
    });
    setIsDialogOpen(true);
  };

  const handleSaveFirmChanges = async () => {
    if (!editingFirm) return;
    
    try {
      const { error } = await supabase
        .from("user_signups")
        .update({
          company: formData.company,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          cardNumber: formData.cardNumber,
          expDate: formData.expDate,
          cvv: formData.cvv,
        })
        .eq("id", editingFirm.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Firm information updated successfully",
      });

      setIsDialogOpen(false);
      fetchFirmSignups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update firm: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm Sign-ups</CardTitle>
        <CardDescription>
          Firms that have registered for the service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Loading firm sign-ups...
                  </TableCell>
                </TableRow>
              ) : paginatedFirmSignups.length > 0 ? (
                paginatedFirmSignups.map((signup) => (
                  <FirmSignupRow
                    key={signup.id}
                    signup={signup}
                    onEdit={handleEditFirm}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No firm sign-ups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <EditFirmDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSaveFirmChanges}
        />
      </CardContent>
    </Card>
  );
}
