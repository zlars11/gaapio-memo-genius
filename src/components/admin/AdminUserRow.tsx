
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserX } from "lucide-react";
import { AdminUser } from "@/types/adminTypes";
import { format } from "date-fns";

interface AdminUserRowProps {
  admin: AdminUser;
  isRemoving: boolean;
  onRemove: () => void;
  isCurrentUser: boolean;
  onUpdateName?: () => void;
}

export function AdminUserRow({ 
  admin, 
  isRemoving, 
  onRemove, 
  isCurrentUser,
  onUpdateName 
}: AdminUserRowProps) {
  const hasName = !!(admin.first_name || admin.last_name);
  const displayName = hasName 
    ? `${admin.first_name || ''} ${admin.last_name || ''}`.trim() 
    : 'No Name';
  
  const formattedDate = admin.created_at 
    ? format(new Date(admin.created_at), 'MMM d, yyyy') 
    : 'Unknown date';
  
  return (
    <TableRow>
      <TableCell className={hasName ? "" : "text-gray-400"}>
        {displayName}
        {!hasName && isCurrentUser && onUpdateName && (
          <Button 
            variant="link" 
            onClick={onUpdateName} 
            className="px-0 h-auto py-0 ml-1">
              (Set your name)
          </Button>
        )}
      </TableCell>
      <TableCell>{admin.email || 'Unknown email'}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-right">
        {!isCurrentUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserX className="h-4 w-4" />
            )}
            <span className="sr-only">Remove admin</span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
