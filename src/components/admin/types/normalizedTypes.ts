
export interface NormalizedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id?: string;
  user_type: 'user' | 'approver' | 'admin'; // Changed from string to specific union
  status: 'active' | 'inactive'; // Changed from string to specific union
  created_at: string;
  updated_at: string | undefined; // Changed from required to optional to match User
  company?: string; // Added missing property
}

// Removed obsolete PaymentDetailsState interface
