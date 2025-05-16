
/**
 * Interface for an admin user
 */
export interface AdminUser {
  id: string;          // Admin user record ID
  user_id: string;     // Supabase Auth user ID
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
}

/**
 * Type for current admin user information
 */
export interface CurrentAdminUser {
  id: string | null;
  email: string | null;
  first_name?: string | null;
  last_name?: string | null;
  isAdmin: boolean;
  displayedInList: boolean;
}

/**
 * Interface for admin form values
 */
export interface AdminFormValues {
  email: string;
  firstName?: string;
  lastName?: string;
}
