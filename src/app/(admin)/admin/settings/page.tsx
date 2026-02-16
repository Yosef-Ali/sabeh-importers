import { getSystemSettings, toggleFreeSubscriptionMode } from "@/lib/actions/settings";
import { SettingsToggle } from "@/components/admin/settings-toggle";
import { getVerificationMethods } from "@/lib/actions/verification-methods";
import { VerificationSettingsCard } from "@/components/admin/verification-settings-card";

export const metadata = {
  title: "System Settings | Admin",
};

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();
  const verificationMethods = await getVerificationMethods();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">System Settings</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Configure global platform behavior.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card">
          <h2 className="text-xl font-display font-bold text-primary mb-4 border-b pb-2">Subscription & Payments</h2>
          
          <SettingsToggle
            label="Free Subscription Mode"
            description="If enabled, all pricing plans will be free ($0). Useful for promotions or testing."
            initialValue={settings.isFreeSubscriptionMode}
            action={toggleFreeSubscriptionMode}
          />
        </div>

        <VerificationSettingsCard methods={verificationMethods} />
      </div>
    </div>
  );
}
