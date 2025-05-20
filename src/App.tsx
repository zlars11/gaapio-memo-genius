
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Contact from './pages/Contact';
import RequestDemo from './pages/RequestDemo';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import FirmSignup from './pages/FirmSignup';
import Admin from './pages/Admin';
import { InitializeWebhooks } from "./components/InitializeWebhooks";

function App() {
  return (
    <>
      <InitializeWebhooks />
      <ErrorBoundary fallback={<div className="p-8 text-center">Something went wrong. Please refresh the page.</div>}>
        <div className="min-h-screen flex flex-col">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-demo" element={<RequestDemo />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/firm-signup" element={<FirmSignup />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;
