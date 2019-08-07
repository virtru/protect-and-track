// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
