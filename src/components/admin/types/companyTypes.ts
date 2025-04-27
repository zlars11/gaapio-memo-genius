
export type CompanyPlan = 'emerging' | 'mid-market' | 'enterprise' | 'firm';

export interface Company {
  id: string;
  name: string;
  plan: CompanyPlan;
  amount: number;
  signup_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  user_limit?: number | null;
}

export interface CompanyDetailsFormProps {
  formData: Partial<Company>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPlanChange: (value: CompanyPlan) => void;
  onStatusChange: (value: "active" | "inactive") => void;
}
