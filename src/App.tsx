
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AIAccounting from "./pages/AIAccounting";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ASC606Pitfalls from "./pages/ASC606Pitfalls";
import OnePager from "./pages/OnePager";
import Status from "./pages/Status";
import SubscriptionAgreement from "./pages/SubscriptionAgreement";
import ChoosePlan from "./pages/ChoosePlan";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import SignUp from "./pages/SignUp";
import FirmSignup from "./pages/FirmSignup";
import Cancel from "./pages/Cancel";
import Success from "./pages/Success";
import RequestDemo from "./pages/RequestDemo";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/why-technical-accounting-memos-matter" element={<BlogPost />} />
        <Route path="/blog/5-common-asc-606-pitfalls" element={<ASC606Pitfalls />} />
        <Route path="/blog/how-ai-is-changing-the-accounting-landscape" element={<AIAccounting />} />
        <Route path="/ssa" element={<SubscriptionAgreement />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onepager" element={<OnePager />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/request-demo" element={<RequestDemo />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/firm-signup" element={<FirmSignup />} />
        <Route path="/choose-plan" element={<ChoosePlan />} />
        <Route path="/status" element={<Status />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
