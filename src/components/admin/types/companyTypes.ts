
export interface Company {
  id: string;
  name: string;
  plan: string;
  user_limit: number | null;
  billing_email: string | null;
  status: string | null;
  created_at: string | null;
  billing_first_name?: string | null;
  billing_last_name?: string | null;
  cardNumberLast4?: string | null;
  expDate?: string | null;
}

export interface PaymentDetails {
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardNumberLast4?: string;
}
