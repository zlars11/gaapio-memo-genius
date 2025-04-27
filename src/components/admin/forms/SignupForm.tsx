
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { handleSignup } from "@/utils/signupUtils";
import { useToast } from "@/components/ui/use-toast";

interface SignupFormProps {
  onSuccess?: (data: { company_id: string; user_id: string }) => void;
  onError?: (error: string) => void;
  defaultValues?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
}

export function SignupForm({ onSuccess, onError, defaultValues = {} }: SignupFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: defaultValues.first_name || '',
    last_name: defaultValues.last_name || '',
    email: defaultValues.email || '',
    phone: defaultValues.phone || '',
    company: defaultValues.company || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.company) {
        throw new Error("Please fill in all required fields");
      }
      
      const result = await handleSignup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        user_type: 'user',
        plan: 'emerging'
      });
      
      if (!result.success) {
        throw new Error(result.error || "Signup failed");
      }
      
      toast({
        title: "Signup successful",
        description: "User and company created successfully",
      });
      
      if (onSuccess && result.company_id && result.user_id) {
        onSuccess({
          company_id: result.company_id,
          user_id: result.user_id
        });
      }
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
      });
      
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred";
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : "Sign Up"}
        </Button>
      </form>
    </Card>
  );
}
