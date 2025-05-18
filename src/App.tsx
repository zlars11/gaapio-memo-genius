
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import Privacy from "./pages/Privacy";
import SubscriptionAgreement from "./pages/SubscriptionAgreement";
import ChoosePlan from "./pages/ChoosePlan";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FirmSignup from "./pages/FirmSignup";
import RequestDemo from "./pages/RequestDemo";
import Blog from "./pages/Blog";
import ASC606Pitfalls from "./pages/ASC606Pitfalls";
import AIAccounting from "./pages/AIAccounting";
import OnePager from "./pages/OnePager";
import Status from "./pages/Status";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { InitializeWebhooks } from "@/components/InitializeWebhooks";
import { PasswordProtection } from "@/components/password-protection/PasswordProtection";

function App() {
  return (
    <div className="app">
      <InitializeWebhooks />
      <Router>
        <PasswordProtection>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/ssa" element={<SubscriptionAgreement />} />
            <Route path="/choose-plan" element={<ChoosePlan />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/firm-signup" element={<FirmSignup />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/5-common-asc-606-pitfalls" element={<ASC606Pitfalls />} />
            <Route path="/blog/how-ai-is-changing-the-accounting-landscape" element={<AIAccounting />} />
            <Route path="/onepager" element={<OnePager />} />
            <Route path="/status" element={<Status />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PasswordProtection>
      </Router>
    </div>
  );
}

export default App;
