export const authenticateWithGoogle = () =>
  'const provider = new Virtru.Client.AuthProviders.GoogleAuthProvider(email, redirectUrl)';
export const authenticateWithO365 = () =>
  'const provider = new Virtru.Client.AuthProviders.O365AuthProvider(email, redirectUrl)';
export const authenticateWithOutlook = () =>
  'const provider = new Virtru.Client.AuthProviders.OutlookAuthProvider(email, redirectUrl)';

export const createVirtruClient = () => `const client = new Virtru.Client.VirtruClient({
 authProvider,
});`;

export const createMockStream = () => 'const contentStream = TDF.createMockStream(fileData);';

export const buildVirtruEncryptParams = () => `const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
  .withStreamSource(contentStream)
  .withPolicy(policy)
  .withDisplayFilename(filename)
  .build();`;

export const encryptFile = () => `await client.encrypt(encryptParams);`;

export const unwrapHtml = () => 'TDF.unwrapHtml(file);';
export const wrapHtml = () => 'TDF.wrapHtml(file);';
