
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FirmSignupsTable() {
  const [firmSignups, setFirmSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFirmSignups() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_signups")
        .select("*")
        .eq("type", "firm")
        .order("signupdate", { ascending: false });

      if (error) {
        console.error("Error fetching firm signups:", error);
        setFirmSignups([]);
      } else {
        setFirmSignups(data || []);
      }
      setLoading(false);
    }

    fetchFirmSignups();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm Sign-ups</CardTitle>
        <CardDescription>
          Firms that have registered for the service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Loading firm sign-ups...
                  </TableCell>
                </TableRow>
              ) : firmSignups.length > 0 ? (
                firmSignups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell>{signup.company}</TableCell>
                    <TableCell>{`${signup.firstname} ${signup.lastname}`.trim()}</TableCell>
                    <TableCell>{signup.email}</TableCell>
                    <TableCell>{signup.phone}</TableCell>
                    <TableCell>{signup.notes || 'No notes'}</TableCell>
                    <TableCell>{new Date(signup.signupdate).toLocaleDateString()}</TableCell>
                    <TableCell>{signup.plan}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No firm sign-ups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
