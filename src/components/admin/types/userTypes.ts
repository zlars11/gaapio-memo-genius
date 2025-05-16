
import { Company } from "./companyTypes";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_id: string | null;
  company?: string;  // Added property to fix build errors
  user_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FirmSignup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_id: string;
  company: string;
  user_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string;
  plan?: string;  // Added property to fix build errors
}

export interface FirmSignupRowProps {
  signup: FirmSignup;
  onEdit: (signup: FirmSignup) => void;
  onDelete: (signup: FirmSignup) => void;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: Company | null;
  userType: string;
  status: string;
}

export interface UserVerificationStatus {
  exists: boolean;
  isActive: boolean;
  isAdmin: boolean;
}
