
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PasswordProtection } from "./components/password-protection/PasswordProtection";

// Pages
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Signup from "./pages/Signup";
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
      <ErrorBoundary>
        <PasswordProtection>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/post" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/one-pager" element={<OnePager />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/policy-detail" element={<PolicyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PasswordProtection>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
