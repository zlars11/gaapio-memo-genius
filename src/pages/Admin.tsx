import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { ZapierWebhookSetup } from "@/components/admin/ZapierWebhookSetup";

export default function Admin() {
  return (
    <div className="space-y-8">
      <WaitlistTable />

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
