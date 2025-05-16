
/**
 * SEO Utilities for generating metadata for pages
 */

type SeoMetadata = {
  title: string;
  description: string;
};

/**
 * Generates SEO metadata based on page title, path, and content
 */
export function generateSeoMetadata(title: string, path: string, content: string): SeoMetadata {
  // Extract base title from the page title
  let cleanTitle = title.replace(/\s-\s.*$/, '').trim();
  
  // Keywords library based on page type
  const keywordsByPath: Record<string, string[]> = {
    // Core Pages
    '/': ['technical accounting software', 'accounting memo generator', 'AI for CPAs'],
    '/about-us': ['accounting software company', 'technical accounting experts', 'CPA tools'],
    '/contact': ['contact accounting software team', 'technical accounting support', 'request information'],
    '/faq': ['technical accounting FAQ', 'accounting memo software questions', 'CPA software FAQ'],
    '/resources': ['accounting resources', 'technical accounting guides', 'CPA tools'],
    
    // Legal Pages
    '/privacy': ['accounting software privacy', 'data security for CPAs', 'accounting data protection'],
    '/ssa': ['subscription service agreement', 'accounting software terms', 'CPA software licensing'],
    
    // Billing Pages
    '/pricing': ['accounting software pricing', 'technical accounting tools cost', 'CPA memo software plans'],
    '/choose-plan': ['accounting software plans', 'technical accounting subscription', 'CPA tools pricing'],
    '/success': ['accounting software activated', 'successful subscription', 'CPA tools access'],
    '/cancel': ['cancel accounting subscription', 'accounting software refund', 'subscription options'],
    
    // User Access
    '/login': ['accounting software login', 'technical accounting platform access', 'CPA tools signin'],
    '/signup': ['accounting software signup', 'technical accounting registration', 'CPA tools account'],
    '/firm-signup': ['CPA firm software', 'accounting firm tools', 'technical accounting for firms'],
    
    // Demo Pages
    '/request-demo': ['accounting software demo', 'technical accounting tools trial', 'CPA software preview'],
    
    // Blog Pages
    '/blog': ['technical accounting blog', 'CPA resources', 'accounting software insights'],
    '/blog/5-common-asc-606-pitfalls': ['ASC 606 compliance', 'revenue recognition', 'accounting standards'],
    '/blog/why-technical-accounting-memos-matter': ['accounting memo importance', 'technical documentation', 'audit preparation'],
    '/blog/how-ai-is-changing-the-accounting-landscape': ['AI accounting', 'machine learning for CPAs', 'automated accounting'],
    
    // Sales Materials
    '/onepager': ['accounting software overview', 'CPA tools summary', 'technical accounting solution'],
    
    // System Pages
    '/status': ['accounting software status', 'system uptime', 'maintenance updates'],
    '/404': ['page not found', 'accounting resources', 'technical accounting help']
  };
  
  // Get keywords for this specific page
  const pageKeywords = keywordsByPath[path] || 
    // If specific path not found, check if it's a blog post
    (path.startsWith('/blog/') ? 
      ['accounting blog', 'CPA resources', 'technical accounting insights'] : 
      ['technical accounting', 'CPA software', 'accounting memos']);
  
  // Extract content text for description generation
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || '';
  
  // Clean content and remove excess whitespace
  const cleanedContent = textContent.replace(/\s+/g, ' ').trim();
  
  // Generate title with keywords
  let seoTitle = cleanTitle;
  
  // Make sure the title includes a keyword if it doesn't already
  const hasKeyword = pageKeywords.some(keyword => 
    cleanTitle.toLowerCase().includes(keyword.toLowerCase().split(' ')[0])
  );
  
  if (!hasKeyword && pageKeywords.length > 0) {
    // Add a relevant keyword to the title
    if (cleanTitle.length < 30) {
      seoTitle = `${cleanTitle} - ${pageKeywords[0].charAt(0).toUpperCase() + pageKeywords[0].slice(1)}`;
    }
  }
  
  // Ensure title isn't too long
  if (seoTitle.length > 60) {
    seoTitle = seoTitle.substring(0, 57) + '...';
  }
  
  // Create description based on content or fallback
  let description = '';
  
  // Try to find first paragraph content
  if (cleanedContent.length > 10) {
    description = cleanedContent.substring(0, 120);
    
    // Add call to action based on page type
    if (path === '/') {
      description += ' Try our AI-powered accounting memo generator today.';
    } else if (path === '/pricing' || path === '/choose-plan') {
      description += ' Choose the plan that fits your accounting needs.';
    } else if (path === '/request-demo') {
      description += ' Request a demo to see our tools in action.';
    } else if (path === '/signup' || path === '/firm-signup') {
      description += ' Create your account to streamline your accounting workflow.';
    } else if (path.startsWith('/blog/')) {
      description += ' Read our expert insights on technical accounting.';
    } else {
      description += ' Learn how our tools help accountants save time and ensure compliance.';
    }
  } else {
    // Create fallback description with keywords
    description = `${cleanTitle}. ${pageKeywords.join(', ')}. `;
    
    // Add appropriate call to action
    if (path === '/') {
      description += 'Streamline your technical accounting workflow with AI-powered memo generation.';
    } else if (path === '/about-us') {
      description += 'Learn about our mission to simplify complex accounting tasks for CPAs and firms.';
    } else if (path === '/contact') {
      description += 'Get in touch with our technical accounting experts for personalized assistance.';
    } else if (path.includes('pricing') || path.includes('plan')) {
      description += 'Explore our affordable plans designed for accountants and firms of all sizes.';
    } else {
      description += 'Our tools help accountants save time while ensuring compliance and accuracy.';
    }
  }
  
  // Ensure description isn't too long
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return {
    title: seoTitle,
    description: description
  };
}

/**
 * Checks for SEO issues in the provided metadata
 */
export function checkSeoIssues(title: string, description: string): string[] {
  const issues: string[] = [];
  
  if (!title) {
    issues.push('Missing meta title');
  } else if (title.length < 30) {
    issues.push('Meta title is too short (under 30 characters)');
  } else if (title.length > 60) {
    issues.push('Meta title is too long (over 60 characters)');
  }
  
  if (!description) {
    issues.push('Missing meta description');
  } else if (description.length < 140) {
    issues.push('Meta description is too short (under 140 characters)');
  } else if (description.length > 160) {
    issues.push('Meta description is too long (over 160 characters)');
  }
  
  return issues;
}
