export const importTdf = () => `import Virtru from 'virtru-tdf3-js';`;
export const importVirtru = () => `import TDF from 'tdf3-js';`;
export const initEncryptParams = () => 'const encryptParams = new TDF.EncryptParamsBuilder();';
export const setFilename = filename => `encryptParams.withFileSource(${filename});`;
export const setPermisions = permisions =>
  `encryptParams.withDissem(${JSON.stringify(permisions)});`;
export const finilizeEncryptParams = () => 'encryptParams.build();';
export const encryptRequest = () => 'await client.encrypt(encryptParams);';

export const authenticateWithGoogle = (
  userEmail,
  redirectUrl,
  stage,
) => `const provider = new Virtru.Client.AuthProviders.GoogleAuthProvider(
  '${userEmail}',
  '${redirectUrl}',
  '${stage}',
);`;

export const createVirtruClient = ({
  acmEndpoint,
  kasEndpoint,
  easEndpoint,
}) => `const client = new Virtru.Client.VirtruClient({
  acmEndpoint: '${acmEndpoint}',
  kasEndpoint: '${kasEndpoint}',
  easEndpoint: '${easEndpoint}',
  authProvider: provider,
});`;

export const createMockStream = () => 'const contentStream = TDF.createMockStream(fileData);';

export const buildVirtruEncryptParams = filename => `const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
  .withStreamSource(contentStream)
  .withPolicy(policy)
  .withDisplayFilename('${filename}')
  .build();`;

export const encryptFile = encryptParams =>
  `await client.encrypt(${JSON.stringify(encryptParams, null, 2)});`;

export const unwrapHtml = () => 'TDF.unwrapHtml(file);';
