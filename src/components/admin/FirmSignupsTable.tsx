
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
import { Input } from "@/components/ui/input";

export function FirmSignupsTable() {
  const [firmSignups, setFirmSignups] = useState<FirmSignup[]>([]);
  const [filteredFirmSignups, setFilteredFirmSignups] = useState<FirmSignup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    items: filteredFirmSignups,
    initialItemsPerPage: 10
  });

  useEffect(() => {
    fetchFirmSignups();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFirmSignups(firmSignups);
    } else {
      const filtered = firmSignups.filter(
        (firm) =>
          (firm.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (firm.firstname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (firm.lastname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (firm.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFirmSignups(filtered);
    }
  }, [searchQuery, firmSignups]);

  async function fetchFirmSignups() {
    setLoading(true);
    try {
      console.log("Fetching firm signups...");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("type", "firm")
        .order("signupdate", { ascending: false });

      if (error) {
        console.error("Error fetching firm signups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch firm signups: " + error.message,
          variant: "destructive",
        });
        setFirmSignups([]);
        setFilteredFirmSignups([]);
      } else {
        console.log("Fetched firm signups:", data);
        const firmData = (data || []).map(item => ({
          ...item,
          id: item.id || "",
          amount: item.amount || "0.00",
          company: item.company || "Unknown Company",
          email: item.email || "",
          firstname: item.firstname || "",
          lastname: item.lastname || "",
          phone: item.phone || "",
          plan: item.plan || "firms",
          status: item.status || "lead",
          signupdate: item.signupdate || new Date().toISOString(),
          term: item.term || "annual",
          type: item.type || "firm",
          notes: item.notes || "",
          is_active: item.is_active !== false
        })) as FirmSignup[];
        
        setFirmSignups(firmData);
        setFilteredFirmSignups(firmData);
      }
    } catch (err: any) {
      console.error("Exception when fetching firm signups:", err);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      setFirmSignups([]);
      setFilteredFirmSignups([]);
    } finally {
      setLoading(false);
    }
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
        .from("users")
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
        <CardTitle>Firms</CardTitle>
        <CardDescription>
          Firms that have registered for the service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by company name, contact name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
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
                    Loading firms...
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
                    {searchQuery ? "No matching firms found." : "No firms found."}
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
