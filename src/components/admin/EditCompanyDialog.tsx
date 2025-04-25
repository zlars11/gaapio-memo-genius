
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSignup } from "./types/userTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditUserDialog from "./EditUserDialog";

interface Company {
  id: string;
  name: string;
  plan: string;
  user_limit: number | null;
  billing_email: string | null;
  status: string | null;
  created_at: string | null;
  billing_first_name?: string | null;
  billing_last_name?: string | null;
  cardNumberLast4?: string | null;
  expDate?: string | null;
}

interface Payment {
  id: string;
  company_id: string;
  amount: string;
  status: string;
  payment_date: string;
  payment_method: string;
  last4?: string;
}

interface EditCompanyDialogProps {
  company: Company;
  onSave: () => void;
  onClose: () => void;
}

export function EditCompanyDialog({ company, onSave, onClose }: EditCompanyDialogProps) {
  const [formData, setFormData] = useState<Company>({...company});
  const [users, setUsers] = useState<UserSignup[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [editUser, setEditUser] = useState<UserSignup | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expDate: formData.expDate || "",
    cvv: "",
  });
  const [cardFieldsModified, setCardFieldsModified] = useState({
    cardNumber: false,
    expDate: false,
    cvv: false
  });

  useEffect(() => {
    fetchUsers();
    fetchPayments();
  }, [company.id]);

  async function fetchUsers() {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("user_signups")
      .select("*")
      .eq("company_id", company.id)
      .order("signupdate", { ascending: false });

    if (error) {
      console.error("Error fetching company users:", error);
    } else {
      setUsers(data as UserSignup[]);
    }
    setLoadingUsers(false);
  }

  async function fetchPayments() {
    setLoadingPayments(true);
    // In a real application, we would fetch from a payments table
    // For now we'll use mock data
    const mockPayments: Payment[] = [
      {
        id: "pay_1",
        company_id: company.id,
        amount: "$99.00",
        status: "completed",
        payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Credit Card",
        last4: company.cardNumberLast4 || "1234"
      },
      {
        id: "pay_2",
        company_id: company.id,
        amount: "$99.00",
        status: "completed",
        payment_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Credit Card",
        last4: company.cardNumberLast4 || "1234"
      }
    ];
    setPayments(mockPayments);
    setLoadingPayments(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCardFieldsModified(prev => ({
      ...prev,
      [name]: true
    }));
    
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCompany = async () => {
    try {
      const updateData: any = {
        name: formData.name,
        plan: formData.plan,
        user_limit: formData.user_limit,
        billing_email: formData.billing_email,
        status: formData.status,
        billing_first_name: formData.billing_first_name,
        billing_last_name: formData.billing_last_name
      };
      
      if (cardFieldsModified.cardNumber && paymentDetails.cardNumber) {
        const last4 = paymentDetails.cardNumber.replace(/\s/g, '').slice(-4);
        updateData.cardNumberLast4 = last4;
      }
      
      if (cardFieldsModified.expDate) {
        updateData.expDate = paymentDetails.expDate;
      }
      
      const { error } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", company.id);

      if (error) throw error;
      
      onSave();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleEditUser = (user: UserSignup) => {
    setEditUser(user);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async (updatedUser: UserSignup) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .update({
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          company: updatedUser.company,
          plan: updatedUser.plan,
          term: updatedUser.term,
          status: updatedUser.status,
          role: updatedUser.role
        })
        .eq("id", updatedUser.id);
      
      if (error) throw error;
      
      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_signups")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      await fetchUsers();
      setUserDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{company.name}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="billing_email">Billing Email</Label>
              <Input
                id="billing_email"
                name="billing_email"
                value={formData.billing_email || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="plan">Plan</Label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 bg-background text-foreground"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <Label htmlFor="user_limit">User Limit</Label>
              <Input
                id="user_limit"
                name="user_limit"
                type="number"
                value={formData.user_limit || ""}
                onChange={handleInputChange}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || "active"}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 bg-background text-foreground"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <Label>Created At</Label>
              <Input
                value={formData.created_at ? formatDate(new Date(formData.created_at)) : "N/A"}
                readOnly
                disabled
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          {loadingUsers ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sign-up Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.firstname || ''} ${user.lastname || ''}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role || 'member'}</TableCell>
                    <TableCell className="capitalize">{user.status || 'active'}</TableCell>
                    <TableCell>{user.signupdate ? formatDate(new Date(user.signupdate)) : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No users found for this company.
            </div>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_first_name">Billing First Name</Label>
                <Input
                  id="billing_first_name"
                  name="billing_first_name"
                  value={formData.billing_first_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="billing_last_name">Billing Last Name</Label>
                <Input
                  id="billing_last_name"
                  name="billing_last_name"
                  value={formData.billing_last_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder={company.cardNumberLast4 ? `•••• •••• •••• ${company.cardNumberLast4}` : "•••• •••• •••• ••••"}
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expDate">Expiration Date</Label>
                  <Input
                    id="expDate"
                    name="expDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expDate}
                    onChange={handlePaymentChange}
                    className="font-mono"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="•••"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentChange}
                    className="font-mono"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment History</h3>
            {loadingPayments ? (
              <div className="text-center py-4">Loading payment history...</div>
            ) : payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(new Date(payment.payment_date))}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell className="capitalize">{payment.status}</TableCell>
                      <TableCell>{payment.payment_method} {payment.last4 ? `(••••${payment.last4})` : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No payment history available.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveCompany}>
          Save Changes
        </Button>
      </div>

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        {editUser && (
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <EditUserDialog
              user={editUser}
              onSave={handleSaveUser}
              onDelete={() => handleDeleteUser(editUser.id)}
              onClose={() => setUserDialogOpen(false)}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
