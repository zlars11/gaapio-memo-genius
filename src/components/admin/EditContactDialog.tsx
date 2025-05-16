
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ContactSubmission {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  date: string;
}

interface EditContactDialogProps {
  contact: ContactSubmission;
  onSave: () => void;
  onClose: () => void;
}

export function EditContactDialog({ contact, onSave, onClose }: EditContactDialogProps) {
  const [formData, setFormData] = useState<ContactSubmission>({...contact});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message
        })
        .eq("id", contact.id);

      if (error) throw error;

      toast({
        title: "Contact updated",
        description: "The contact submission has been updated successfully."
      });
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Edit Contact Submission</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
