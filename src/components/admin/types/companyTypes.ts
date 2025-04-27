
export interface Company {
  id: string;
  name: string;
  plan: 'emerging' | 'mid-market' | 'enterprise' | 'firm';
  amount: number;
  signup_date: string;
  status: 'active' | 'inactive';
  billing_contact?: string;
  billing_email?: string;
  stripe_customer_id?: string;
  billing_frequency?: string;
  notes?: string;
  industry?: string;
  logo_url?: string;
  trial_end_date?: string;
  created_at: string;
  updated_at: string;
  user_limit?: number | null;
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
