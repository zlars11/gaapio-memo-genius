
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
  expDate?: string;
  cvv?: string;
}

export interface UserSignupRowProps {
  user: UserSignup;
  onEdit: (user: UserSignup) => void;
}

export interface FirmSignup extends UserSignup {
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
