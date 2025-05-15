
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface AdminTab {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export function TabVisibilitySettings() {
  const { toast } = useToast();
  
  const [tabs, setTabs] = useState<AdminTab[]>([
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Overview of key metrics and settings",
      visible: true
    },
    {
      id: "companies",
      name: "Companies",
      description: "Manage company accounts",
      visible: true
    },
    {
      id: "users",
      name: "Users",
      description: "Manage user accounts",
      visible: true
    },
    {
      id: "contacts",
      name: "Contacts",
      description: "View contact form submissions",
      visible: true
    },
    {
      id: "demos",
      name: "Demo Requests",
      description: "Manage demo requests",
      visible: true
    },
    {
      id: "firms",
      name: "Firm Signups",
      description: "Manage firm signup requests",
      visible: true
    },
    {
      id: "pricing",
      name: "Pricing",
      description: "Manage product pricing",
      visible: true
    },
    {
      id: "webpages",
      name: "Webpages",
      description: "Manage website content",
      visible: true
    },
    {
      id: "settings",
      name: "Settings",
      description: "Admin system settings",
      visible: true
    }
  ]);
  
  // Load saved tab visibility settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("adminTabVisibility");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge saved settings with default settings to ensure we have all tabs
        setTabs(prevTabs => {
          return prevTabs.map(tab => {
            const savedTab = parsedSettings.find((st: AdminTab) => st.id === tab.id);
            return savedTab ? { ...tab, visible: savedTab.visible } : tab;
          });
        });
      } catch (error) {
        console.error("Error loading tab visibility settings:", error);
      }
    }
  }, []);
  
  const handleToggleChange = (id: string, checked: boolean) => {
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.id === id ? { ...tab, visible: checked } : tab
    ));
  };
  
  const saveSettings = () => {
    // Ensure at least one tab remains visible - settings tab should always be visible
    const hasVisibleTabs = tabs.some(tab => tab.visible);
    
    if (!hasVisibleTabs) {
      toast({
        title: "Error",
        description: "At least one tab must remain visible.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("adminTabVisibility", JSON.stringify(tabs));
    
    toast({
      title: "Settings saved",
      description: "Tab visibility settings have been updated.",
    });
  };
  
  const resetToDefault = () => {
    setTabs(prevTabs => prevTabs.map(tab => ({ ...tab, visible: true })));
    
    toast({
      title: "Settings reset",
      description: "Tab visibility has been reset to defaults.",
    });
  };
  
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Tab Visibility</CardTitle>
        <CardDescription>
          Control which tabs are visible in the admin portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{tab.name}</div>
                <p className="text-sm text-muted-foreground">
                  {tab.description}
                </p>
              </div>
              <Switch
                id={`tab-${tab.id}`}
                checked={tab.visible}
                onCheckedChange={(checked) => handleToggleChange(tab.id, checked)}
                disabled={tab.id === "settings"} // Always keep settings tab visible
                aria-label={`Toggle visibility of ${tab.name} tab`}
              />
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 pt-6 mt-4 border-t">
            <Button variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <Button onClick={saveSettings}>
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
