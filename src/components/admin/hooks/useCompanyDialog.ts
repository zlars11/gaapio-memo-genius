
import { useState } from "react";
import { Company } from "../types/companyTypes";
import { NormalizedUser, PaymentDetailsState } from "../types/normalizedTypes";
import { User } from "../types/userTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useCompanyDialog(company: Company, onSave: () => void) {
  const [formData, setFormData] = useState<Partial<Company>>({...company});
  const [users, setUsers] = useState<NormalizedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editUser, setEditUser] = useState<NormalizedUser | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { toast } = useToast();

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsState>({
    cardNumber: "",
    expDate: formData.expDate || "",
    cvv: "",
    cardNumberLast4: company.cardNumberLast4
  });

  const [newUser, setNewUser] = useState<Partial<User>>({
    company_id: company.id,
    company: company.name,
    plan: company.plan,
    status: 'active',
    role: 'member',
    is_active: true,
    type: 'user'
  });

  // Helper function to normalize user data
  const normalizeUser = (user: User): NormalizedUser => ({
    id: user.id,
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    company: user.company || company.name,
    company_id: user.company_id || company.id,
    plan: user.plan || company.plan,
    status: user.status || "active",
    amount: user.amount || "0.00",
    signupdate: user.signupdate || new Date().toISOString(),
    term: user.term || "annual",
    role: user.role || "member",
    is_active: user.is_active ?? true,
    type: user.type || "user",
    notes: user.notes || "",
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", company.id);

      if (error) throw error;
      
      const normalizedUsers = (data || []).map(normalizeUser);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    users,
    loadingUsers,
    editUser,
    userDialogOpen,
    createUserDialogOpen,
    deleteDialogOpen,
    deletePassword,
    deleteError,
    paymentDetails,
    newUser,
    setFormData,
    setUsers,
    setEditUser,
    setUserDialogOpen,
    setCreateUserDialogOpen,
    setDeleteDialogOpen,
    setDeletePassword,
    setDeleteError,
    setPaymentDetails,
    setNewUser,
    normalizeUser,
    fetchUsers,
    handleInputChange,
    handlePaymentChange
  };
}
