
import { ContactForm } from "@/components/contact/ContactForm";

interface FirmContactFormProps {
  onSuccess: (data: any) => void;
}

export function FirmContactForm({ onSuccess }: FirmContactFormProps) {
  // Ensure we're passing the correct plan value to ContactForm
  return <ContactForm onSubmitSuccess={onSuccess} planType="firm" />;
}
