export default (name, url) => {
  url = url || window.location.href;
  if (URL) {
    return new URL(window.location.href).searchParams.get(name);
  }
  name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
