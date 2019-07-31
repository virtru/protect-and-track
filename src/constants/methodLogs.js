export const createVirtruClient = () => `const client = new Virtru.Client.VirtruClient({
 authProvider,
});`;

export const createMockStream = () => 'const contentStream = TDF.createMockStream(fileData);';

export const buildEncryptParams = () => `const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
  .withStreamSource(contentStream)
  .withPolicy(policy)
  .withDisplayFilename(filename)
  .build();`;

export const encryptFile = () => `await client.encrypt(encryptParams);`;

export const unwrapHtml = () => 'TDF.unwrapHtml(file);';
export const wrapHtml = () => 'TDF.wrapHtml(file);';
