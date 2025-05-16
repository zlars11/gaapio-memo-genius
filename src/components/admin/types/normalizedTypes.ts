
export interface NormalizedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id?: string;
  user_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Removed obsolete PaymentDetailsState interface
