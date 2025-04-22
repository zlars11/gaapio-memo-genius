
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { UserSignupsTable } from "@/components/admin/UserSignupsTable";

/**
 * The Admin Portal includes:
 * - Admin dashboard metrics & CTA toggle
 * - Waitlist table with Zapier integration
 * - User sign-ups table with Zapier integration
 * - Contact submissions table with Zapier integration
 * - Admin page guard for authentication
 * 
 * All major functionality is restored.
 */
export default function Admin() {
  return (
    <AdminPageGuard>
      <div className="max-w-6xl mx-auto py-8 space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Portal</h1>
        <AdminDashboard />

        <section>
          <WaitlistTable />
        </section>
        
        <section>
          <UserSignupsTable />
        </section>

        <section>
          <ContactTable />
        </section>
      </div>
    </AdminPageGuard>
  );
}
