
/**
 * Interface for Supabase Auth User
 * Represents the structure of user objects returned from Supabase Auth API
 */
export interface SupabaseAuthUser {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
  aud: string;
  confirmation_sent_at?: string;
  confirmed_at?: string;
  created_at: string;
  email?: string | null;
  email_confirmed_at?: string;
  phone?: string | null;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
}

/**
 * Interface for Supabase Auth response
 */
export interface SupabaseAuthResponse {
  data: {
    user: SupabaseAuthUser | null;
    session?: any;
  };
  error: Error | null;
}

/**
 * Interface for Supabase Auth data response
 */
export interface SupabaseAuthDataResponse {
  user: SupabaseAuthUser | null;
  session?: any;
}
