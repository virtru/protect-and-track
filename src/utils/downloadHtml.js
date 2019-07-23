export default encryptedFile => {
  const html = new TextDecoder('utf-8').decode(encryptedFile.payload);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', encryptedFile.name);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
