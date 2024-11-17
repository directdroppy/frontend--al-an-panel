import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);

    // Update matches when the media query changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern browsers
    media.addEventListener('change', listener);

    return () => {
      // Cleanup
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}