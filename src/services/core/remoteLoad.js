let remoteLoad = (id, src) =>
  new Promise((resolve, reject) => {
    const element = document.getElementById(id);
    if (element) {
      return resolve(true);
    }
    const newEl = document.createElement('script');
    newEl.src = src;
    newEl.id = id;
    newEl.onload = resolve;
    newEl.onabort = () => reject(new Error(`Error loading ${id}.`));
    newEl.onerror = () => reject(new Error(`${id}  loading aborted.`));
    document.body.appendChild(newEl);
  });

async function loadGapi() {
  const gapi = await remoteLoad('gapi', 'https://apis.google.com/js/api.js');
  return gapi;
}

export { remoteLoad, loadGapi };
