import Virtru from './VirtruWrapper';

const downloadFile = (buffer, fileName) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(buffer));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadHtml = encrypted => {
  const html = new TextDecoder('utf-8').decode(encrypted.payload);
  return downloadFile(html, encrypted.name);
};

export const downloadTdf = encrypted => {
  const tdf = Virtru.unwrapHtml(encrypted.payload);
  return downloadFile(tdf, encrypted.name.replace('.html', '.tdf'));
};

export const downloadDecrypted = async ({ encrypted, virtruClient }) => {
  const tdf = Virtru.unwrapHtml(encrypted.payload);
  const decrypted = await Virtru.decrypt({ virtruClient, encryptedFile: tdf });
  return downloadFile(decrypted, encrypted.name.replace('.html', ''));
};
