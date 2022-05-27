export const isSupportedBrowser = () => {
  //https://jsfiddle.net/6spj1059/
  const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  return isChrome;
};
