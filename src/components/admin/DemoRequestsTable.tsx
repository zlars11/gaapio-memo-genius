
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ZapierWebhookSetup } from "./ZapierWebhookSetup";
import { PaginatedTable } from "./PaginatedTable";
import { DemoRequest } from "./types/demoRequestTypes";
import { EditDemoDialog } from "./dialogs/EditDemoDialog";
import { DeleteDemoConfirmDialog } from "./dialogs/DeleteDemoConfirmDialog";
import { useDemoRequests } from "./hooks/useDemoRequests";
import { getDemoTableColumns } from "./components/DemoTableColumns";

export function DemoRequestsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { requests, loading, fetchDemoRequests, handleSearch } = useDemoRequests();

  useEffect(() => {
    fetchDemoRequests();
  }, []);

  const handleEdit = (request: DemoRequest) => {
    setSelectedRequest(request);
    setShowEditDialog(true);
  };

  const handleDelete = (request: DemoRequest) => {
    setSelectedRequest(request);
    setShowDeleteDialog(true);
  };

  const columns = getDemoTableColumns(handleEdit, handleDelete);

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="max-w-md"
            />
          </div>
          
          <PaginatedTable
            data={requests}
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
