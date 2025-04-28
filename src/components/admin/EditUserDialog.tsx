
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserInfoForm } from "./forms/UserInfoForm";
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
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleFieldChange
  } = useEditUserForm(user);

  function handleSave() {
    const saveData = { 
      ...user,
      ...fields,
      plan, 
      term, 
      status: status as 'active' | 'inactive',
      _csrf: csrfToken
    };
    
    onSave(saveData);
  }

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Strictly validate the value is one of the allowed user types
    if (value !== 'admin' && value !== 'approver' && value !== 'user') {
      console.warn('Invalid user type provided:', value);
      return;
    }
    
    // Cast to the specific union type
    const userType = value as 'user' | 'approver' | 'admin';
    
    handleFieldChange({
      target: { 
        name: 'user_type', 
        value: userType
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Strictly validate status value
    if (value !== 'active' && value !== 'inactive') {
      console.warn('Invalid status provided:', value);
      return;
    }
    
    // Cast to the specific union type
    setStatus(value as 'active' | 'inactive');
  };

  return (
    <div className="relative">
      <DialogHeader className="mb-4">
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Update user information.
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
          onStatusChange={handleStatusChange}
          onUserTypeChange={handleUserTypeChange}
          PLAN_OPTIONS={PLAN_OPTIONS}
          TERM_OPTIONS={TERM_OPTIONS}
          STATUS_OPTIONS={STATUS_OPTIONS}
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
