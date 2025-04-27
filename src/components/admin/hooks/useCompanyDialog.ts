
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "../types/companyTypes";
import { NormalizedUser, PaymentDetailsState } from "../types/normalizedTypes";
import { User } from "../types/userTypes";

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
    user_type: 'user',
    status: 'active'
  });

  const normalizeUser = (user: any): NormalizedUser => ({
    id: user.id,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    company_id: user.company_id || company.id,
    user_type: user.user_type || "user",
    status: user.status || "active",
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || new Date().toISOString()
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", company.id);

      if (error) throw error;
      
      const normalizedUsers = data ? data.map(normalizeUser) : [];
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
