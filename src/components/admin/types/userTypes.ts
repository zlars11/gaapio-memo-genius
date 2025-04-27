
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id?: string;
  company?: string;
  user_type: 'user' | 'approver' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
}

export interface FirmSignup extends User {
  company: string;
  notes?: string;
}

export interface FirmSignupRowProps {
  signup: FirmSignup;
  onEdit: (signup: FirmSignup) => void;
}

export interface CardValidation {
  cardNumberValid: boolean;
  expDateValid: boolean;
  cvvValid: boolean;
}
