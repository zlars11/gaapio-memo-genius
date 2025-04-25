
import { Input } from "@/components/ui/input";

interface UserSignupsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSignupsSearch({ value, onChange }: UserSignupsSearchProps) {
  return (
    <div className="mb-4">
      <Input
        placeholder="Search by name, email, company, or plan..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
}
