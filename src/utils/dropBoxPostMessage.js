export default function() {
  window.addEventListener('load', function() {
    const message = window.location.href;
    window.location.hash = '';

    if (window.parent !== window.top) {
      window.opener = window.opener || window.parent;
    }

    if (window.opener && message) {
      window.opener.postMessage(message, window.location.origin);
      window.close();
    }
  });
}
