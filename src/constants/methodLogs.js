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
}) => `const client = new Virtru.Client({
  acmEndpoint: '${acmEndpoint}',
  kasEndpoint: '${kasEndpoint}',
  easEndpoint: '${easEndpoint}',
  authProvider: provider,
});`;

export const createMockStream = () => 'const contentStream = TDF.createMockStream(fileData);';

export const buildPolicy = () => 'const policy = new Virtru.PolicyBuilder().build();';

export const buildEncryptParams = filename => `const encryptParams = new Virtru.Client.EncryptParamsBuilder()
  .withStreamSource(contentStream)
  .withPolicy(policy)
  .withDisplayFilename('${filename}')
  .build();`;

export const encryptFile = encryptParams =>
  `await client.encrypt(${JSON.stringify(encryptParams, null, 2)});`;

export const unwrapHtml = () => 'TDF.unwrapHtml(file);';
