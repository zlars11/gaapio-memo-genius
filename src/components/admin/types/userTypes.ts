export interface UserSignup {
  id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  company?: string;
  company_id?: string; // Added this field to support company relationship
  plan: string;
  status?: string;
  amount?: string;
  signupdate?: string;
  term?: string;
  cardNumber?: string;
  cardNumberLast4?: string;
  expDate?: string;
  cvv?: string;
  role?: string;
  is_active?: boolean; // Added this field that was missing
  type?: string; // Added this field that might be used elsewhere
}

export interface UserSignupRowProps {
  user: UserSignup;
  onEdit: (user: UserSignup) => void;
}

export interface FirmSignup extends UserSignup {
  company: string; // Making company required, not optional
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

