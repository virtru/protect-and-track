import Virtru from 'virtru-tdf3-js';
import TDF from 'tdf3-js';

const envs = {
  develop01: {
    stage: 'develop01',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    acmEndpoint: 'https://acm-develop01.develop.virtru.com',
    easEndpoint: 'https://accounts-develop01.develop.virtru.com',
    startUrl: 'https://secure-develop01.develop.virtru.com/start',
  },
  staging: {
    stage: 'staging',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    acmEndpoint: 'https://acm.staging.virtru.com',
    easEndpoint: 'https://accounts.staging.virtru.com',
    startUrl: 'https://secure.staging.virtru.com/start',
  },
  production: {
    stage: 'production',
    kasEndpoint: 'https://api.virtru.com/kas',
    acmEndpoint: 'https://acm.virtru.com',
    easEndpoint: 'https://accounts.virtru.com',
    startUrl: 'https://secure.virtru.com/start',
  },
};

function getEnvironment() {
  const stage = process.env.VIRTRU_ENV || 'develop01';
  return envs[stage];
}

function buildClient(userEmail) {
  const { acmEndpoint, kasEndpoint, easEndpoint, stage } = getEnvironment();

  const provider = new Virtru.Client.AuthProviders.GoogleAuthProvider(
    userEmail,
    'local.virtru.com',
    stage,
  );

  const client = new Virtru.Client.VirtruClient({
    acmEndpoint,
    kasEndpoint,
    easEndpoint,
    authProvider: provider,
  });

  return client;
}

async function streamToBuffer(stream) {
  const bufs = [];
  stream.on('data', function(d) {
    bufs.push(d);
  });
  return new Promise(resolve => {
    stream.on('end', function() {
      resolve(Buffer.concat(bufs));
    });
  });
}

/**
 * Encrypt a file
 * @param {Buffer} fileData
 * @param {String} filename
 * @param {String} userEmail
 * @param {Boolean} asHtml
 */
async function encrypt(fileData, filename, userEmail, asHtml) {
  const { startUrl } = getEnvironment();
  const client = buildClient(userEmail);
  const contentStream = TDF.createMockStream(fileData);
  const policy = new Virtru.Client.VirtruPolicyBuilder().build();

  const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
    .withStreamSource(contentStream)
    .withPolicy(policy)
    .withDisplayFilename(filename)
    .build();

  const ct = await client.encrypt(encryptParams);
  const buffer = await streamToBuffer(ct);

  if (!asHtml) {
    return buffer;
  }

  const manifestString = ''; // TODO: Confirmed with Tyler this is not needed for now
  return TDF.wrapHtml(buffer, manifestString, `${startUrl}?htmlProtocol=1`);
}

export { encrypt };
