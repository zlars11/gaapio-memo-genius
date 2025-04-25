
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginatedTable } from "./PaginatedTable";
import { formatDate } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  plan: string;
  user_limit: number | null;
  billing_email: string | null;
  status: string | null;
  created_at: string | null;
}

export function CompaniesTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
        setFilteredCompanies([]);
      } else {
        setCompanies(data as Company[]);
        setFilteredCompanies(data as Company[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.billing_email || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const columns = [
    {
      header: "Company Name",
      accessorKey: "name" as keyof Company,
    },
    {
      header: "Plan",
      accessorKey: "plan" as keyof Company,
      cell: (item: Company) => (
        <span className="capitalize">{item.plan}</span>
      ),
    },
    {
      header: "User Limit",
      accessorKey: "user_limit" as keyof Company,
      cell: (item: Company) => (
        <span>{item.user_limit || "Unlimited"}</span>
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
            placeholder="Search by company name, plan, or email..."
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
      </CardContent>
    </Card>
  );
}
