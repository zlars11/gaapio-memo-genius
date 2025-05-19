
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useDemoRequestForm } from "./hooks/useDemoRequestForm";
import { DemoRequestFormFields } from "./components/DemoRequestFormFields";

interface DemoRequestFormProps {
  onSuccess?: () => void;
}

export function DemoRequestForm({ onSuccess }: DemoRequestFormProps) {
  const { form, isLoading, onSubmit } = useDemoRequestForm(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <DemoRequestFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full dark:text-white dark:hover:bg-primary/60" 
          size="lg"
          variant="blue"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Request Demo"}
        </Button>
      </form>
    </Form>
  );
}
