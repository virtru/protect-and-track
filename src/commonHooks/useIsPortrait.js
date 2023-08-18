import { useState, useEffect } from 'react';

// ipad portrait view screen width is 768px
let mql = null;

export const useIsPortrait = () => {
  if (!mql) {
    mql = window.matchMedia(`(max-width: 768px)`);
  }
  const [mediaIsMatched, setMediaIsMatched] = useState(mql.matches);

  const resolutionHandler = () => setMediaIsMatched(mql.matches);

  useEffect(() => {
    if (mql.addEventListener) {
      mql.addEventListener(resolutionHandler);
      return () => mql.removeEventListener(resolutionHandler);
    }
    mql.addListener(resolutionHandler);
    return () => mql.removeListener(resolutionHandler);
  }, []);

  return mediaIsMatched;
};
