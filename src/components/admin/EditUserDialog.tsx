
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserInfoForm } from "./forms/UserInfoForm";
import { PaymentDetailsForm } from "./forms/PaymentDetailsForm";
import { DeleteUserConfirmDialog } from "./dialogs/DeleteUserConfirmDialog";
import { useEditUserForm } from "./hooks/useEditUserForm";
import { PLAN_OPTIONS, TERM_OPTIONS, STATUS_OPTIONS } from "./constants/userDialogOptions";
import { getCSRFToken } from "@/utils/securityUtils";
import { Button } from "@/components/ui/button";
import { User } from "./types/userTypes";
import { useState } from "react";

interface EditUserDialogProps {
  user: User;
  onSave: (user: any) => void;
  onDelete: () => void;
  onClose?: () => void;
}

export default function EditUserDialog({ user, onSave, onDelete, onClose }: EditUserDialogProps) {
  const [csrfToken] = useState(() => getCSRFToken());
  
  const {
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
  } = useEditUserForm(user);

  function handleSave() {
    setShowValidation(true);
    
    if (!validation.cardNumberValid || !validation.expDateValid || !validation.cvvValid) {
      return;
    }
    
    const saveData = { 
      ...user,
      ...fields, 
      plan, 
      term, 
      status: status as 'active' | 'inactive',
      _csrf: csrfToken
    };
    
    if (cardFieldsModified.cardNumber && paymentDetails.cardNumber !== "•••" && paymentDetails.cardNumber !== "") {
      // Instead of storing card data directly, we'll handle this via Stripe later
      saveData.cardData = 'REDACTED';
    }
    
    if (cardFieldsModified.expDate && paymentDetails.expDate !== "") {
      // Similarly, we'll handle expiration dates via Stripe later
      saveData.expData = 'REDACTED';
    }
    
    delete saveData.cvv;
    
    onSave(saveData);
  }

  return (
    <div className="relative">
      <DialogHeader className="mb-4">
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Update user information and payment details.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <input type="hidden" name="_csrf" value={csrfToken} />
        
        <UserInfoForm 
          fields={fields}
          plan={plan}
          term={term}
          status={status}
          onChange={handleFieldChange}
          onPlanChange={(e) => setPlan(e.target.value)}
          onTermChange={(e) => setTerm(e.target.value)}
          onStatusChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          PLAN_OPTIONS={PLAN_OPTIONS}
          TERM_OPTIONS={TERM_OPTIONS}
          STATUS_OPTIONS={STATUS_OPTIONS}
        />
        
        <PaymentDetailsForm 
          paymentDetails={paymentDetails}
          onPaymentChange={handlePaymentChange}
          validation={validation}
          showValidation={showValidation}
        />

        <div className="flex gap-3 mt-8 justify-between">
          <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete User
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <DeleteUserConfirmDialog
          onConfirm={onDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
