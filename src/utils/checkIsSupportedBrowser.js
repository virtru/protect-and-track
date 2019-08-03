export default () => {
  //https://jsfiddle.net/6spj1059/
  // const isFirefox = typeof InstallTrigger !== 'undefined';
  const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  return isChrome;
};
