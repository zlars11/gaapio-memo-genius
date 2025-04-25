
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  company: string;
  company_id: string;
  plan: string;
  status: string;
  amount: string;
  signupdate?: string;
  term?: string;
  cardNumber?: string;
  cardNumberLast4?: string;
  expDate?: string;
  cvv?: string;
  role?: string;
  is_active: boolean;
  type?: string;
  notes?: string;
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
