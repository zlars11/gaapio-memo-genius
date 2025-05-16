
export interface User {
  id: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  user_type: 'user' | 'approver' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  company?: string; // Added missing property
}

export interface FirmSignup {
  id: string;
  company: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id?: string;
  user_type: 'user' | 'approver' | 'admin';
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at?: string;
  plan?: string; // Added missing property
}
