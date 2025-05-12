
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ResourceCenter() {
  return (
    <section 
      className="py-16 md:py-20 bg-accent/30 dark:bg-[#1A1F2B]"
      aria-labelledby="resources-heading"
    >
      <ResponsiveContainer className="max-w-5xl">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 
            id="resources-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Helpful Resources for Accounting & Finance Teams
          </h2>
          <p className="section-subtitle">
            Stay sharp with our curated links to essential accounting standards, tools, and guides.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Accounting Standards & Guidance */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2" />
              <h3 className="text-xl font-semibold">Accounting Standards & Guidance</h3>
            </div>
            <Separator className="w-full mb-4" />
            <ul className="space-y-3 text-center md:text-left w-full">
              <li>
                <a 
                  href="https://asc.fasb.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>FASB ASC Codification</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.sec.gov/divisions/corpfin/guidance/cfactfaq.htm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>SEC Accounting Guidance</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ifrs.org/issued-standards/list-of-standards/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>IFRS Standards</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Technical Tools */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2" />
              <h3 className="text-xl font-semibold">Technical Tools</h3>
            </div>
            <Separator className="w-full mb-4" />
            <ul className="space-y-3 text-center md:text-left w-full">
              <li>
                <a 
                  href="https://www.ey.com/en_us/assurance/accountinglink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>EY Accounting Standards Hub</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
              <li>
                <a 
                  href="https://viewpoint.pwc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>PWC Inform</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.iasplus.com/en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>Deloitte iGAAP</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Templates & Downloads */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2" />
              <h3 className="text-xl font-semibold">Templates & Downloads</h3>
            </div>
            <Separator className="w-full mb-4" />
            <ul className="space-y-3 text-center md:text-left w-full">
              <li>
                <Link 
                  to="#" 
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>ASC 606 Memo Template</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>Audit-Ready Memo Checklist</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="flex items-center justify-center md:justify-start hover:text-primary transition-colors"
                >
                  <span>GAAP Pitfalls Cheat Sheet</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
