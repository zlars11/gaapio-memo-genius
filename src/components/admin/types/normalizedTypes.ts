export interface NormalizedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id: string;
  user_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentDetailsState {
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardNumberLast4?: string;
}
