
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Logo src always the same regardless of theme
  const logoSrc = "/lovable-uploads/e263b9d6-518b-411f-be9f-c36067fd9ad1.png";
  
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content - Ultra compact layout */}
      <div className="container px-4 md:px-6 py-6">
        {/* Grid Layout for Logo & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Logo Column - Left aligned and vertically aligned with headers */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/">
              <img src={logoSrc} alt="Gaapio" className="h-12 w-auto" />
            </Link>
          </div>
          
          {/* Three Column Grid Layout for Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 col-span-1 md:col-span-3 gap-4 md:gap-16 text-center md:text-left">
            {/* Company Column */}
            <div className="mb-2 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about-us" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/request-demo" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://app.gaapio.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    App
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Resources Column */}
            <div className="mb-2 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/resources" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Resource Center
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/status" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dpa" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/ssa" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Connect Column */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/contact" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <Linkedin className="h-3 w-3 text-gray-300" />
                  <Link 
                    to="#" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <Twitter className="h-3 w-3 text-gray-300" />
                  <Link 
                    to="#" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Twitter
                  </Link>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <Youtube className="h-3 w-3 text-gray-300" />
                  <Link 
                    to="#" 
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-sm"
                  >
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Legal Strip - Ultra compact */}
      <div className="border-t border-gray-800">
        <div className="container px-4 md:px-6 py-2 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <p className="text-xs text-gray-400 mb-1 md:mb-0">
            &copy; {currentYear} Gaapio. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0 md:space-x-6">
            <Link 
              to="/dpa" 
              className="text-xs text-gray-400 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-3 hidden md:inline-block bg-gray-700" />
            <Link 
              to="/ssa" 
              className="text-xs text-gray-400 hover:underline transition-colors"
            >
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-3 hidden md:inline-block bg-gray-700" />
            <Link 
              to="#" 
              className="text-xs text-gray-400 hover:underline transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
