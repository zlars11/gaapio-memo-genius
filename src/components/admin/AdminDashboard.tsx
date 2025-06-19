
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HomepageCtaToggle } from "@/components/admin/HomepageCtaToggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FeatureToggles } from "@/components/admin/FeatureToggles";
import { UnderConstructionToggle } from "@/components/admin/UnderConstructionToggle";

export function AdminDashboard() {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [showMetricsOnHomepage, setShowMetricsOnHomepage] = useState(false);
  
  // Simulate fetching counts (in a real app, this would be an API call)
  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockWaitlistData = JSON.parse(localStorage.getItem("waitlistSubmissions") || "[]");
    const mockContactData = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
    const mockUserData = JSON.parse(localStorage.getItem("userSignups") || "[]");
    
    setWaitlistCount(mockWaitlistData.length);
    setContactCount(mockContactData.length);
    setUserCount(mockUserData.length);
    
    const showMetrics = localStorage.getItem("showMetricsOnHomepage") === "true";
    setShowMetricsOnHomepage(showMetrics);
  }, []);

  const handleToggleMetricsVisibility = (checked: boolean) => {
    setShowMetricsOnHomepage(checked);
    localStorage.setItem("showMetricsOnHomepage", checked.toString());
  };

  return (
    <div className="space-y-6">
      <UnderConstructionToggle />
      
      <Card>
        <CardHeader>
          <CardTitle>Homepage CTA Settings</CardTitle>
          <CardDescription>
            Toggle between different call-to-action buttons on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HomepageCtaToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Feature Toggles</CardTitle>
          <CardDescription>
            Enable or disable features on your website (testimonials, pricing, partner logos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureToggles />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Waitlist Submissions" value={waitlistCount} />
            <MetricCard title="Contact Submissions" value={contactCount} />
            <MetricCard title="User Sign-ups" value={userCount} />
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-metrics" 
                checked={showMetricsOnHomepage}
                onCheckedChange={handleToggleMetricsVisibility}
              />
              <Label htmlFor="show-metrics">
                Show metrics on homepage (for admins only)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-accent/50 rounded-lg p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
