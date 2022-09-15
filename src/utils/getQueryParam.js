export const getQueryParam = (name, url) => {
  url = url || window.location.href;
  if (URL) {
    return new URL(url).searchParams.get(name);
  }
  name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  const value = results[2];
  if (!value) {
    return '';
  }
  return decodeURIComponent(value.replace(/\+/g, ' '));
};
