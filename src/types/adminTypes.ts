
export interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export interface CurrentAdminUser {
  id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  isAdmin: boolean;
  displayedInList: boolean;
}

export interface AdminFormValues {
  firstName: string;
  lastName: string;
  email: string;
}
