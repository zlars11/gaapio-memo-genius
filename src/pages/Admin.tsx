
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { ContactTable } from "@/components/admin/ContactTable";
import { UserSignupsTable } from "@/components/admin/UserSignupsTable";
import { FeatureToggles } from "@/components/admin/FeatureToggles";
import { AdminPageGuard } from "@/components/admin/AdminPageGuard";

export default function Admin() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage settings, view submissions, and control website features
            </p>
          </div>

          <AdminPageGuard>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="waitlist">Waitlist Submissions</TabsTrigger>
                <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
                <TabsTrigger value="users">User Sign-ups</TabsTrigger>
                <TabsTrigger value="settings">Feature Toggles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <AdminDashboard />
              </TabsContent>
              
              <TabsContent value="waitlist" className="space-y-6">
                <WaitlistTable />
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6">
                <ContactTable />
              </TabsContent>
              
              <TabsContent value="users" className="space-y-6">
                <UserSignupsTable />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <FeatureToggles />
              </TabsContent>
            </Tabs>
          </AdminPageGuard>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
