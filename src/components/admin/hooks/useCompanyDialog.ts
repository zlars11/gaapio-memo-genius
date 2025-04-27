
import { useState, ChangeEvent } from 'react';
import { Company, CompanyPlan } from '../types/companyTypes';
import { User } from '../types/userTypes';

export function useCompanyDialog(company: Partial<Company>) {
  const [formData, setFormData] = useState<Partial<Company>>({
    ...company
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanChange = (value: CompanyPlan) => {
    setFormData(prev => ({
      ...prev,
      plan: value
    }));
  };

  const handleStatusChange = (value: 'active' | 'inactive') => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
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
    setUserDialogOpen,
    setCreateUserDialogOpen,
    setEditUser
  };
}
