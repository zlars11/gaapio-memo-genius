
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";

// Pages
import Index from "./pages/Index";
import AccountingMemos from "./pages/AccountingMemos";
import FootnoteDisclosures from "./pages/FootnoteDisclosures";
import GuidanceUpdates from "./pages/GuidanceUpdates";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import SignUp from "./pages/SignUp";
import RequestDemo from "./pages/RequestDemo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OnePager from "./pages/OnePager";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import PolicyDetail from "./pages/PolicyDetail";

function App() {
  return (
    <Router>
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
            <Route path="/guidance-updates" element={<GuidanceUpdates />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/post" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/one-pager" element={<OnePager />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/policy-detail" element={<PolicyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedLayout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
