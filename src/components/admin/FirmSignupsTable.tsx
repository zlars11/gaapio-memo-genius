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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Pen } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "./PaginationControls";

interface FirmSignup {
  id: string;
  company: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  notes?: string; // Keep this as optional since we might get it from legacy data
  signupdate: string;
  plan: string;
}

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
          // Removed notes to match the database schema
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
        <div className="rounded-md border">
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
              <TableRow key={signup.id}>
                <TableCell>{signup.company}</TableCell>
                <TableCell>{`${signup.firstname} ${signup.lastname}`.trim()}</TableCell>
                <TableCell>{signup.email}</TableCell>
                <TableCell>{signup.phone}</TableCell>
                <TableCell>{new Date(signup.signupdate).toLocaleDateString()}</TableCell>
                <TableCell>{signup.plan}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFirm(signup)}
                  >
                    <Pen className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
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

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    value={formData.firstname || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    value={formData.lastname || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveFirmChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
