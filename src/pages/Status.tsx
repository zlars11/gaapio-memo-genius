
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Status() {
  const [lastChecked, setLastChecked] = useState<string>("Loading...");
  
  useEffect(() => {
    // Simulate getting the current time
    const now = new Date();
    setLastChecked(now.toLocaleString());
  }, []);
  
  // Mock service status data
  const services = [
    { name: "API Service", status: "operational", uptime: "99.99%" },
    { name: "Web Application", status: "operational", uptime: "99.97%" },
    { name: "Authentication", status: "operational", uptime: "100%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "File Storage", status: "operational", uptime: "99.95%" }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="page-container flex-1">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">System Status</h1>
              <div className="flex items-center justify-center gap-2 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-lg font-medium">All systems operational</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Last checked: {lastChecked}</p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Services</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                    <div>
                      <p className="font-medium">{service.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Operational</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6 mb-20">
              <h2 className="text-xl font-semibold mb-4">Scheduled Maintenance</h2>
              <div className="flex items-center gap-3 p-4 rounded-md bg-accent/50">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">No scheduled maintenance at this time.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
