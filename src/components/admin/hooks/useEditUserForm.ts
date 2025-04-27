
import { useState } from "react";
import { validateCardNumber, validateExpiryDate, validateCVV, formatCardNumber, formatExpiryDate } from "@/utils/cardValidation";
import { User } from "../types/userTypes";

interface FormFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
}

interface PaymentDetails {
  cardNumber: string;
  expDate: string;
  cvv: string;
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
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expDate: "",
    cvv: ""
  });
  
  const [cardFieldsModified, setCardFieldsModified] = useState({
    cardNumber: false,
    expDate: false,
    cvv: false
  });
  
  const [validation, setValidation] = useState({
    cardNumberValid: true,
    expDateValid: true,
    cvvValid: true
  });
  
  const [showValidation, setShowValidation] = useState(false);

  function maskCardNumber(number: string) {
    if (!number) return "";
    const cleanNumber = number.replace(/\s/g, '');
    return cleanNumber.slice(-4).padStart(cleanNumber.length, '•').replace(/(.{4})(?=.)/g, '$1 ');
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handlePaymentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let formattedValue = value;
    
    setCardFieldsModified(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }
    
    if (name === "expDate") {
      formattedValue = formatExpiryDate(value);
    }
    
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setPaymentDetails(prev => ({ ...prev, [name]: formattedValue }));
    
    // Update validation state
    setValidation(prev => ({
      ...prev,
      cardNumberValid: name === "cardNumber" ? validateCardNumber(formattedValue) : prev.cardNumberValid,
      expDateValid: name === "expDate" ? validateExpiryDate(formattedValue) : prev.expDateValid,
      cvvValid: name === "cvv" ? validateCVV(formattedValue) : prev.cvvValid
    }));
  }

  return {
    plan,
    setPlan,
    term,
    setTerm,
    status,
    setStatus,
    fields,
    paymentDetails,
    validation,
    showValidation,
    setShowValidation,
    cardFieldsModified,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleFieldChange,
    handlePaymentChange
  };
}
