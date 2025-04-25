
export interface UserSignup {
  id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  company?: string;
  plan: string;
  status?: string;
  amount?: string;
  signupdate?: string;
  term?: string;
  cardNumber?: string;
  cardNumberLast4?: string; // Added this field to support storing last 4 digits
  expDate?: string;
  cvv?: string;
  role?: string; // Added role property to fix the type error
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
