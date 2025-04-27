
// This ensures we have a consistent normalized user type across components
export interface NormalizedUser {
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
  signupdate: string;
  term: string;
  role: string;
  is_active: boolean;
  type: string;
  notes: string;
}

export interface PaymentDetailsState {
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardNumberLast4?: string;
}
