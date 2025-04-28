
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";
import { PaginatedTable } from "./PaginatedTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DemoRequestFormData } from "../demo/types/demoRequestTypes";
import { EditDemoDialog } from "./dialogs/EditDemoDialog";
import { DeleteDemoConfirmDialog } from "./dialogs/DeleteDemoConfirmDialog";

interface DemoRequest extends DemoRequestFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

export function DemoRequestsTable() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DemoRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const fetchDemoRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch demo requests",
        variant: "destructive",
      });
      setRequests([]);
      setFilteredRequests([]);
    } else {
      setRequests(data);
      setFilteredRequests(data);
    }
    setLoading(false);
  };

  useState(() => {
    fetchDemoRequests();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (request) =>
          request.firstName.toLowerCase().includes(query.toLowerCase()) ||
          request.lastName.toLowerCase().includes(query.toLowerCase()) ||
          request.email.toLowerCase().includes(query.toLowerCase()) ||
          (request.notes || "").toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  const handleEdit = (request: DemoRequest) => {
    setSelectedRequest(request);
    setShowEditDialog(true);
  };

  const handleDelete = (request: DemoRequest) => {
    setSelectedRequest(request);
    setShowDeleteDialog(true);
  };

  const columns = [
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
            onClick={() => handleEdit(request)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(request)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demo Requests</CardTitle>
          <CardDescription>
            View and manage demo requests from potential customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, or notes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <PaginatedTable
            data={filteredRequests}
            columns={columns}
            loading={loading}
            searchQuery={searchQuery}
            caption="A list of demo requests."
            noDataMessage="No demo requests yet."
          />
        </CardContent>
      </Card>

      <ZapierWebhookSetup
        webhookType="demoRequest"
        description="Receive a webhook trigger when a new demo request is submitted."
      />

      {selectedRequest && (
        <>
          <EditDemoDialog
            request={selectedRequest}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSuccess={fetchDemoRequests}
          />
          <DeleteDemoConfirmDialog
            request={selectedRequest}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onSuccess={fetchDemoRequests}
          />
        </>
      )}
    </div>
  );
}
