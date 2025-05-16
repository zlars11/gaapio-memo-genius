
import { useState, useEffect, ChangeEvent } from 'react';
import { User } from '../types/userTypes';

interface FormFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
}

export function useEditUserForm(user: User) {
  const [plan, setPlan] = useState(user?.user_type || 'user');
  const [term, setTerm] = useState('annual');
  const [status, setStatus] = useState(user?.status || 'active');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [fields, setFields] = useState<FormFields>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFields({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      });
      setPlan(user.user_type || 'user');
      setStatus(user.status || 'active');
    }
  }, [user]);

  // Handle form field changes
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prevFields => ({ ...prevFields, [name]: value }));
  };
  
  return {
    plan,
    setPlan,
    term,
    setTerm,
    status,
    setStatus,
    fields,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleFieldChange
  };
}
