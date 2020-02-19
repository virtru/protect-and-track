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

import Virtru from 'utils/sdk';
import logAction from 'utils/virtruActionLogger';

function click(node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    node.dispatchEvent(evt);
  }
}

export function saver(blob, name) {
  const a = document.createElement('a');
  a.download = name;
  a.rel = 'noopener';
  a.href = URL.createObjectURL(blob);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
  }, 4e4); // 40s
  click(a);
}

export const downloadHtml = async encrypted => {
  const html = new TextDecoder('utf-8').decode(encrypted.payload);
  const blob = new Blob([html], { type: 'text/plain;charset=utf-8' });
  return saver(blob, encrypted.name);
};

function getOriginalNameOf(encrypted) {
  if (encrypted.name.endsWith('.html')) {
    return encrypted.name.substring(0, encrypted.name.length - 5);
  }
  if (encrypted.name.endsWith('.tdf')) {
    return encrypted.name.substring(0, encrypted.name.length - 4);
  }
  return encrypted.name;
}

export const downloadTdf = async encrypted => {
  const html = new TextDecoder('utf-8').decode(encrypted.payload);

  // Virtru: Unwrap the encrypted HTML file
  logAction('unwrapHtml');
  const tdf = window.TDF.unwrapHtml(html); // TODO: implement using Virtru SDK

  const blob = new Blob([tdf]);
  const originalName = getOriginalNameOf(encrypted);
  return saver(blob, originalName + '.tdf');
};

/**** Virtru Block ****
 *
 * The following code shows how to decrypt a file
 * https://developer.virtru.com/docs/how-to-decrypt-a-file
 *
 */
export const downloadDecrypted = async ({ encrypted, virtruClient }) => {
  // Virtru: Create decrypt params builder
  // https://docs.developer.virtru.com/js/latest/DecryptParamsBuilder.html
  logAction('createDecryptParams');
  const decryptParams = new Virtru.DecryptParamsBuilder()
    .withArrayBufferSource(encrypted.payload)
    .build();

  // Virtru: Decrypt the file
  // https://docs.developer.virtru.com/js/latest/Client.html#decrypt
  logAction('decryptFile');
  const decryptStream = await virtruClient.decrypt(decryptParams);
  const decrypted = await decryptStream.toBuffer();

  const blob = new Blob([decrypted]);
  const originalName = getOriginalNameOf(encrypted);
  return saver(blob, originalName);
};
/**** END Virtru Block ****/
