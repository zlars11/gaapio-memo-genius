
import { useState, ChangeEvent } from 'react';
import { User } from '@/components/admin/types/userTypes';

export type NormalizedUser = User;

export interface Company {
  id: string;
  name: string;
  plan: string;
  status: string;
  amount: number;
  billing_frequency?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export function useCompanyDialog(company: Partial<Company>) {
  const [formData, setFormData] = useState<Partial<Company>>({
    ...company
  });

  const [users, setUsers] = useState<NormalizedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<NormalizedUser | null>(null);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      plan: e.target.value
    }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleBillingFrequencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      billing_frequency: e.target.value
    }));
  };

  const openUserDialog = (user: NormalizedUser) => {
    setEditUser(user);
    setUserDialogOpen(true);
  };

  const closeUserDialog = () => {
    setUserDialogOpen(false);
    setEditUser(null);
  };

  const openCreateUserDialog = () => {
    setCreateUserDialogOpen(true);
  };

  const closeCreateUserDialog = () => {
    setCreateUserDialogOpen(false);
  };

  return {
    formData,
    users,
    loadingUsers,
    editUser,
    userDialogOpen,
    createUserDialogOpen,
    handleInputChange,
    handlePlanChange,
    handleStatusChange,
    handleBillingFrequencyChange,
    openUserDialog,
    closeUserDialog,
    openCreateUserDialog,
    closeCreateUserDialog
  };
}
