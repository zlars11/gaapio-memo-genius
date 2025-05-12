
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useDemoRequestForm } from "./hooks/useDemoRequestForm";
import { DemoRequestFormFields } from "./components/DemoRequestFormFields";

export function DemoRequestForm() {
  const { form, isLoading, onSubmit } = useDemoRequestForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <DemoRequestFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full" 
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
