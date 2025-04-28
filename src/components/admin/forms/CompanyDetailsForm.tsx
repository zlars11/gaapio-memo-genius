
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Company, CompanyPlan } from "../types/companyTypes";

interface CompanyDetailsFormProps {
  formData: Partial<Company>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPlanChange: (value: CompanyPlan) => void;
  onStatusChange: (value: "active" | "inactive") => void;
}

export function CompanyDetailsForm({
  formData,
  onInputChange,
  onPlanChange,
  onStatusChange,
}: CompanyDetailsFormProps) {
  // Handle number inputs separately to ensure proper type conversion
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? null : Number(value);
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name,
        value: numberValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="plan">Plan</Label>
        <select
          id="plan"
          name="plan"
          value={formData.plan || "emerging"}
          onChange={(e) => onPlanChange(e.target.value as CompanyPlan)}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="emerging">Emerging</option>
          <option value="mid-market">Mid-Market</option>
          <option value="enterprise">Enterprise</option>
          <option value="firm">Firm</option>
        </select>
      </div>

      <div>
        <Label htmlFor="user_limit">User Limit</Label>
        <Input
          id="user_limit"
          name="user_limit"
          type="number"
          value={formData.user_limit === null ? '' : formData.user_limit}
          onChange={handleNumberInputChange}
          placeholder="Leave empty for unlimited"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={formData.status || "active"}
          onChange={(e) => onStatusChange(e.target.value as "active" | "inactive")}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount || 0}
          onChange={handleNumberInputChange}
        />
      </div>

      <div>
        <Label htmlFor="billing_frequency">Billing Frequency</Label>
        <select
          id="billing_frequency"
          name="billing_frequency"
          value={formData.billing_frequency || "annual"}
          onChange={onInputChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="annual">Annual</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      <div>
        <Label htmlFor="billing_contact">Billing Contact</Label>
        <Input
          id="billing_contact"
          name="billing_contact"
          value={formData.billing_contact || ""}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="billing_email">Billing Email</Label>
        <Input
          id="billing_email"
          name="billing_email"
          type="email"
          value={formData.billing_email || ""}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label>Created At</Label>
        <Input
          value={formData.created_at ? new Date(formData.created_at).toLocaleDateString() : "N/A"}
          readOnly
          disabled
        />
      </div>
    </div>
  );
}
