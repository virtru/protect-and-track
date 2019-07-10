import React from 'react';
// ipad portrait view screen width is 768px
const mql = window.matchMedia(`(max-width: 768px)`);
const { useState, useEffect } = React;

export default () => {
  const [mediaIsMatched, setMediaIsMatched] = useState(mql.matches);

  const resolutionHandler = () => setMediaIsMatched(mql.matches);

  useEffect(() => {
    mql.addListener(resolutionHandler);
    return () => mql.removeListener(resolutionHandler);
  }, []);

  return mediaIsMatched;
};
