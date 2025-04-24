
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
}

export interface UserSignupRowProps {
  user: UserSignup;
  onEdit: (user: UserSignup) => void;
}
