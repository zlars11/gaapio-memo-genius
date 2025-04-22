import { UserSignupsTable } from "@/components/admin/UserSignupsTable";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";
import { WaitlistTable } from "@/components/admin/WaitlistTable";

// Keep the admin layout simple, display WaitlistTable, UserSignupsTable, and webhook setup
export default function Admin() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Portal</h1>

      <WaitlistTable />

      <UserSignupsTable />

      {/* ----- User Signup Webhook Setup ------ */}
      <div className="max-w-2xl mx-auto mt-8">
        <ZapierWebhookSetup
          webhookType="userSignup"
          description="Receive an email when a new user subscribes via the signup form"
        />
      </div>
    </div>
  );
}
