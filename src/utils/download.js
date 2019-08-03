import Virtru from './VirtruWrapper';

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
  console.log(JSON.stringify(html));
  const blob = new Blob([...html], { type: 'text/plain;charset=utf-8' });
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
  const tdf = Virtru.unwrapHtml(html);
  const blob = new Blob([tdf]);
  const originalName = getOriginalNameOf(encrypted);
  return saver(blob, originalName + '.tdf');
};

export const downloadDecrypted = async ({ encrypted, virtruClient }) => {
  const encryptedBuffer = encrypted.payload;
  const decrypted = await Virtru.decrypt({ virtruClient, encryptedBuffer });
  const blob = new Blob([decrypted]);
  const originalName = getOriginalNameOf(encrypted);
  return saver(blob, originalName);
};
