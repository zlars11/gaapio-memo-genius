
import { ContactForm } from "@/components/contact/ContactForm";

interface FirmContactFormProps {
  onSuccess: (data: any) => void;
}

export function FirmContactForm({ onSuccess }: FirmContactFormProps) {
  return <ContactForm onSubmitSuccess={onSuccess} />;
}
