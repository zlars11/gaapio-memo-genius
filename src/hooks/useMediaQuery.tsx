
import { useEffect, useState } from "react";

type MediaQueryType = 
  | 'xs'   // 475px
  | 'sm'   // 640px
  | 'md'   // 768px
  | 'lg'   // 1024px
  | 'xl'   // 1280px
  | '2xl'  // 1400px
  | '3xl'; // 1600px

const breakpoints = {
  'xs': '475px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1400px',
  '3xl': '1600px',
};

/**
 * Custom hook to check if the current viewport matches a given media query.
 * @param {MediaQueryType} query - The breakpoint to check against
 * @param {boolean} defaultState - Default state to return during SSR
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query: MediaQueryType, defaultState = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[query]})`);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener to update state
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener("change", listener);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

/**
 * Returns the current breakpoint based on window width
 * @returns {MediaQueryType | null} - Current active breakpoint or null if SSR
 */
export function useBreakpoint(): MediaQueryType | null {
  const [breakpoint, setBreakpoint] = useState<MediaQueryType | null>(null);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 475) return null;
      if (width < 640) return 'xs';
      if (width < 768) return 'sm';
      if (width < 1024) return 'md';
      if (width < 1280) return 'lg';
      if (width < 1400) return 'xl';
      if (width < 1600) return '2xl';
      return '3xl';
    };

    // Set initial value
    setBreakpoint(checkBreakpoint());

    // Add event listener
    const handleResize = () => {
      setBreakpoint(checkBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
}
