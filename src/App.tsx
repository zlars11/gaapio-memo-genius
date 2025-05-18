import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import Privacy from "./pages/Privacy";
import SSA from "./pages/SSA";
import ChoosePlan from "./pages/ChoosePlan";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FirmSignup from "./pages/FirmSignup";
import RequestDemo from "./pages/RequestDemo";
import Blog from "./pages/Blog";
import ArticleASC606 from "./pages/ArticleASC606";
import ArticleTechMemos from "./pages/ArticleTechMemos";
import ArticleAIinAccounting from "./pages/ArticleAIinAccounting";
import OnePager from "./pages/OnePager";
import Status from "./pages/Status";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { InitializeWebhooks } from "@/components/InitializeWebhooks";

function App() {
  return (
    <div className="app">
      <InitializeWebhooks />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/ssa" element={<SSA />} />
          <Route path="/choose-plan" element={<ChoosePlan />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/firm-signup" element={<FirmSignup />} />
          <Route path="/request-demo" element={<RequestDemo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/5-common-asc-606-pitfalls" element={<ArticleASC606 />} />
          <Route path="/blog/why-technical-accounting-memos-matter" element={<ArticleTechMemos />} />
          <Route path="/blog/how-ai-is-changing-the-accounting-landscape" element={<ArticleAIinAccounting />} />
          <Route path="/onepager" element={<OnePager />} />
          <Route path="/status" element={<Status />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
