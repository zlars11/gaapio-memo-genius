
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Company } from "../types/companyTypes";

interface CompanyDetailsFormProps {
  formData: Partial<Company>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function CompanyDetailsForm({
  formData,
  onInputChange,
}: CompanyDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="plan">Plan</Label>
        <select
          id="plan"
          name="plan"
          value={formData.plan}
          onChange={onInputChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div>
        <Label htmlFor="user_limit">User Limit</Label>
        <Input
          id="user_limit"
          name="user_limit"
          type="number"
          value={formData.user_limit || ""}
          onChange={onInputChange}
          placeholder="Leave empty for unlimited"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={formData.status || "active"}
          onChange={onInputChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
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
