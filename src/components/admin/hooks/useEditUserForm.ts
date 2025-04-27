
import { useState } from "react";
import { User } from "../types/userTypes";

interface FormFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
}

export function useEditUserForm(user: User) {
  const [plan, setPlan] = useState<string>("emerging");
  const [term, setTerm] = useState<string>("annual");
  const [status, setStatus] = useState<"active" | "inactive">(user.status || "active");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [fields, setFields] = useState<FormFields>({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    company: user.company || "",
  });

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  return {
    plan,
    setPlan,
    term,
    setTerm,
    status,
    setStatus,
    fields,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleFieldChange
  };
}
