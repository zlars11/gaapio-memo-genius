
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserInfoFormProps {
  fields: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    company: string;
  };
  plan: string;
  term: string;
  status: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlanChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTermChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  PLAN_OPTIONS: Array<{ value: string; label: string; }>;
  TERM_OPTIONS: Array<{ value: string; label: string; }>;
  STATUS_OPTIONS: Array<{ value: string; label: string; }>;
}

export function UserInfoForm({
  fields,
  plan,
  term,
  status,
  onChange,
  onPlanChange,
  onTermChange,
  onStatusChange,
  PLAN_OPTIONS,
  TERM_OPTIONS,
  STATUS_OPTIONS,
}: UserInfoFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstname">First Name</Label>
        <Input id="firstname" name="firstname" value={fields.firstname} onChange={onChange} placeholder="First Name" />
      </div>
      <div>
        <Label htmlFor="lastname">Last Name</Label>
        <Input id="lastname" name="lastname" value={fields.lastname} onChange={onChange} placeholder="Last Name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" value={fields.email} onChange={onChange} placeholder="Email" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={fields.phone} onChange={onChange} placeholder="Phone" />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" value={fields.company} onChange={onChange} placeholder="Company" />
      </div>
      <div>
        <Label htmlFor="plan">Plan</Label>
        <select 
          id="plan" 
          name="plan" 
          value={plan} 
          onChange={onPlanChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          {PLAN_OPTIONS.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="term">Term</Label>
        <select 
          id="term" 
          name="term" 
          value={term} 
          onChange={onTermChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          {TERM_OPTIONS.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select 
          id="status" 
          name="status" 
          value={status} 
          onChange={onStatusChange}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          {STATUS_OPTIONS.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
