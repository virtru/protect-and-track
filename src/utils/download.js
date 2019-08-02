import Virtru from './VirtruWrapper';
import FileSaver from 'file-saver';

export const downloadHtml = encrypted => {
  const html = new TextDecoder('utf-8').decode(encrypted.payload);
  const blob = new Blob([...html], { type: 'text/plain;charset=utf-8' });
  return FileSaver.saveAs(blob, encrypted.name);
};

export const downloadTdf = encrypted => {
  const html = new TextDecoder('utf-8').decode(encrypted.payload);
  const tdf = Virtru.unwrapHtml(html);
  const blob = new Blob([tdf]);
  return FileSaver.saveAs(blob, encrypted.name.replace('.html', '.tdf'));
};

export const downloadDecrypted = async ({ encrypted, virtruClient }) => {
  const encryptedBuffer = encrypted.payload;
  const decrypted = await Virtru.decrypt({ virtruClient, encryptedBuffer });
  const blob = new Blob([decrypted]);
  return FileSaver.saveAs(blob, encrypted.name.replace('.html', ''));
};
