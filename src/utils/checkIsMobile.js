export const isMobile = () => {
  const ipadWith = 768;
  // eslint-disable-next-line no-restricted-globals
  return screen.width < ipadWith;
};
