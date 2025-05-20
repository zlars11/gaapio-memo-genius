
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  FileText, 
  Clipboard, 
  MessageSquare, 
  CheckCircle2,
  History,
  Search,
  FileCode,
  PenLine
} from "lucide-react";
import { useState } from "react";
import { AnimatedMemo } from "@/components/home/AnimatedMemo";
import { Link } from "react-router-dom";

export default function PolicyDetail() {
  const [activeTab, setActiveTab] = useState("memo");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <ResponsiveContainer className="max-w-7xl">
          {/* Policy Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/policies">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Policies
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold ml-4">Revenue recognition</h1>
            </div>
            
            <Button variant="outline" size="sm">
              <PenLine className="h-4 w-4 mr-2" /> Edit Policy
            </Button>
          </div>
          
          {/* Policy Tabs */}
          <Tabs defaultValue="memo" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">
                <Clipboard className="h-4 w-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Search className="h-4 w-4" /> AI Analysis
              </TabsTrigger>
              <TabsTrigger value="memo">
                <FileText className="h-4 w-4" /> Memo
              </TabsTrigger>
              <TabsTrigger value="review">
                <MessageSquare className="h-4 w-4" /> Review
              </TabsTrigger>
              <TabsTrigger value="approval">
                <CheckCircle2 className="h-4 w-4" /> Approval
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white border border-border/30 rounded-lg mt-4 min-h-[600px]">
              {/* Details Tab */}
              <TabsContent value="details" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
                <p className="text-muted-foreground">
                  Basic information about the revenue recognition policy.
                </p>
              </TabsContent>
              
              {/* Analysis Tab */}
              <TabsContent value="analysis" className="p-6">
                <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
                <p className="text-muted-foreground">
                  AI-powered analysis of your revenue recognition approach.
                </p>
              </TabsContent>
              
              {/* Memo Tab */}
              <TabsContent value="memo" className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Technical Accounting Memo</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <History className="h-3.5 w-3.5 mr-1" /> Version History
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileCode className="h-3.5 w-3.5 mr-1" /> Export PDF
                    </Button>
                  </div>
                </div>
                
                {/* Centered Animated Memo with proper styling */}
                <div className="flex items-center justify-center py-8">
                  <div className="w-full max-w-4xl transform">
                    <AnimatedMemo />
                  </div>
                </div>
              </TabsContent>
              
              {/* Review Tab */}
              <TabsContent value="review" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Review Comments</h2>
                <p className="text-muted-foreground">
                  Team feedback and review notes for this policy.
                </p>
              </TabsContent>
              
              {/* Approval Tab */}
              <TabsContent value="approval" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Policy Approval</h2>
                <p className="text-muted-foreground">
                  Approval workflow and sign-offs.
                </p>
              </TabsContent>
            </div>
          </Tabs>
          
          {/* Action buttons */}
          <div className="flex justify-end mt-6">
            <Button variant="outline" className="mr-2">Save Draft</Button>
            <Button variant="blue">Submit for Review</Button>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}
