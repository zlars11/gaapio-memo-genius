
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginatedTable } from "./PaginatedTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { EditCompanyDialog } from "./EditCompanyDialog";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "./types/companyTypes";

export function CompaniesTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      console.log("Fetching companies...");
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Error",
          description: "Failed to fetch companies",
          variant: "destructive",
        });
        setCompanies([]);
        setFilteredCompanies([]);
      } else {
        console.log("Fetched companies:", data);
        const typedCompanies = data as unknown as Company[];
        setCompanies(typedCompanies);
        setFilteredCompanies(typedCompanies);
      }
    } catch (err) {
      console.error("Exception when fetching companies:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.plan.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setEditDialogOpen(true);
  };

  const handleCompanyUpdate = async () => {
    await fetchCompanies();
    setEditDialogOpen(false);
  };

  const columns = [
    {
      header: "Company Name",
      accessorKey: "name" as keyof Company,
      cell: (item: Company) => (
        <button 
          className="text-primary hover:underline text-left font-medium"
          onClick={() => handleEditCompany(item)}
        >
          {item.name}
        </button>
      ),
    },
    {
      header: "Plan",
      accessorKey: "plan" as keyof Company,
      cell: (item: Company) => (
        <span className="capitalize">{item.plan}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Company,
      cell: (item: Company) => (
        <span className="capitalize">{item.status || "active"}</span>
      ),
    },
    {
      header: "Created",
      accessorKey: "created_at" as keyof Company,
      cell: (item: Company) => (
        <span>{item.created_at ? formatDate(new Date(item.created_at)) : "N/A"}</span>
      ),
    },
    {
      header: "",
      accessorKey: "actions" as keyof Company,
      cell: (item: Company) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleEditCompany(item);
          }}
          className="h-8 w-8 p-0 float-right"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit company</span>
        </Button>
      ),
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>
          View and manage company accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by company name or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <PaginatedTable
          data={filteredCompanies}
          columns={columns}
          loading={loading}
          searchQuery={searchQuery}
          caption="A list of all companies"
          noDataMessage="No companies found"
        />

        {selectedCompany && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              <EditCompanyDialog 
                company={selectedCompany}
                onSave={handleCompanyUpdate}
                onClose={() => setEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
