
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import RequestDemo from "./pages/RequestDemo";
import Blog from "./pages/Blog";
import AIAccounting from "./pages/AIAccounting";
import ASC606Pitfalls from "./pages/ASC606Pitfalls";
import FirmSignup from "./pages/FirmSignup";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import Resources from "./pages/Resources";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import DPA from "./pages/DPA";
import SubscriptionAgreement from "./pages/SubscriptionAgreement";
import OnePager from "./pages/OnePager";
import Status from "./pages/Status";
import ChoosePlan from "./pages/ChoosePlan";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import { SignUpInfoForm } from "./pages/SignUpInfoForm";
import { SignUpPaymentForm } from "./pages/SignUpPaymentForm";
import { SignUpSummary } from "./pages/SignUpSummary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BlogPost from "./pages/BlogPost";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-demo" element={<RequestDemo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} /> {/* Add BlogPost route */}
              <Route path="/ai-accounting" element={<AIAccounting />} />
              <Route path="/blog/5-common-asc-606-pitfalls" element={<ASC606Pitfalls />} />
              <Route path="/firm-signup" element={<FirmSignup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/dpa" element={<DPA />} />
              <Route path="/ssa" element={<SubscriptionAgreement />} />
              <Route path="/onepager" element={<OnePager />} />
              <Route path="/status" element={<Status />} />
              <Route path="/choose-plan" element={<ChoosePlan />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/signup/info" element={<SignUpInfoForm />} />
              <Route path="/signup/payment" element={<SignUpPaymentForm />} />
              <Route path="/signup/summary" element={<SignUpSummary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
