
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";

interface UserInfoFormProps {
  onSubmit: (userData: UserFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export function UserInfoForm({ onSubmit, onBack, isLoading }: UserInfoFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Clear general submission error when user makes changes
    if (submissionError) {
      setSubmissionError(null);
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    
    if (validateForm()) {
      try {
        onSubmit(formData);
      } catch (error: any) {
        console.error("Error submitting form:", error);
        setSubmissionError(error.message || "An error occurred while submitting your information. Please try again.");
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Complete Your Information</h2>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company Name*</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
            </div>

            {submissionError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <p className="text-sm">{submissionError}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Continue to Payment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
