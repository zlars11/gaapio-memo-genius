
import { DemoRequest } from "../types/demoRequestTypes";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const getDemoTableColumns = (
  onEdit: (request: DemoRequest) => void,
  onDelete: (request: DemoRequest) => void
) => [
  {
    header: "Name",
    cell: (request: DemoRequest) => (
      <span className="font-medium">{`${request.firstName} ${request.lastName}`}</span>
    ),
  },
  {
    header: "Email",
    accessorKey: "email" as keyof DemoRequest,
  },
  {
    header: "Phone",
    accessorKey: "phone" as keyof DemoRequest,
  },
  {
    header: "Notes",
    accessorKey: "notes" as keyof DemoRequest,
    cell: (request: DemoRequest) => (
      <div className="max-w-xs truncate">{request.notes || "—"}</div>
    ),
  },
  {
    header: "Date",
    accessorKey: "created_at" as keyof DemoRequest,
    cell: (request: DemoRequest) => (
      new Date(request.created_at).toLocaleDateString()
    ),
  },
  {
    header: "Actions",
    cell: (request: DemoRequest) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(request)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(request)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
