import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { UnderConstructionPage } from "./components/UnderConstructionPage";
import { supabase } from "@/integrations/supabase/client";

// Pages
import Index from "./pages/Index";
import AccountingMemos from "./pages/AccountingMemos";
import FootnoteDisclosures from "./pages/FootnoteDisclosures";
import ContractAnalysis from "./pages/ContractAnalysis";
import GuidanceUpdates from "./pages/GuidanceUpdates";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Resources from "./pages/Resources";
import FAQ from "./pages/FAQ";
import SignUp from "./pages/SignUp";
import RequestDemo from "./pages/RequestDemo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OnePager from "./pages/OnePager";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import PolicyDetail from "./pages/PolicyDetail";
import Status from "./pages/Status";
import Privacy from "./pages/Privacy";
import SSA from "./pages/SSA";

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConstructionMode = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('under_construction')
          .single();

        if (error) {
          console.error('Error checking construction mode:', error);
          setIsUnderConstruction(false);
          return;
        }

        setIsUnderConstruction(data?.under_construction || false);
      } catch (error) {
        console.error('Error checking construction mode:', error);
        setIsUnderConstruction(false);
      }
    };

    checkConstructionMode();

    // Set up real-time subscription to listen for changes
    const channel = supabase
      .channel('site_config_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_config'
        },
        (payload) => {
          setIsUnderConstruction(payload.new.under_construction);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Show loading state while checking construction mode
  if (isUnderConstruction === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show construction page if enabled
  if (isUnderConstruction) {
    return <UnderConstructionPage />;
  }

  // Normal app flow
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
            <p className="mb-4">We're sorry, but an error has occurred.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      }>
        <ProtectedLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/accounting-memos" element={<AccountingMemos />} />
            <Route path="/footnote-disclosures" element={<FootnoteDisclosures />} />
            <Route path="/contract-analysis" element={<ContractAnalysis />} />
            <Route path="/guidance-updates" element={<GuidanceUpdates />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/post" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/one-pager" element={<OnePager />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/policy-detail" element={<PolicyDetail />} />
            <Route path="/status" element={<Status />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dpa" element={<Privacy />} />
            <Route path="/ssa" element={<SSA />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedLayout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
