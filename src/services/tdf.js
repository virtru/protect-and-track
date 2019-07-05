import Virtru from 'virtru-tdf3-js';
import TDF from 'tdf3-js';

const envs = {
  develop01: {
    stage: 'develop01',
    kasEndpoint: 'https://api-develop01.develop.virtru.com/kas',
    acmEndpoint: 'https://acm-develop01.develop.virtru.com',
    easEndpoint: 'https://accounts-develop01.develop.virtru.com',
  },
  staging: {
    stage: 'staging',
    kasEndpoint: 'https://api.staging.virtru.com/kas',
    acmEndpoint: 'https://acm.staging.virtru.com',
    easEndpoint: 'https://accounts.staging.virtru.com',
  },
  production: {
    stage: 'production',
    kasEndpoint: 'https://api.virtru.com/kas',
    acmEndpoint: 'https://acm.virtru.com',
    easEndpoint: 'https://accounts.virtru.com',
  },
};

//Add required endpoint selections given the correct environment
function getEndpointsByEnvironment() {
  const stage = process.env.VIRTRU_ENV || 'develop01';
  return envs[stage];
}

function buildClient(user) {
  const { acmEndpoint, kasEndpoint, easEndpoint, stage } = getEndpointsByEnvironment();
  const provider = new Virtru.Client.AuthProviders.GoogleAuthProvider(
    user,
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

//Convert a stream to a buffer
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
 *
 * @param {*} fileData
 * @param {*} filename
 * @param {*} userId
 * @param {*} asHtml
 */
async function encrypt(fileData, filename, userId, asHtml) {
  //TODO use withBuffer

  const client = buildClient();
  const contentStream = TDF.createMockStream(fileData);
  const policy = new Virtru.Client.VirtruPolicyBuilder().build();

  const encryptParams = new Virtru.Client.VirtruEncryptParamsBuilder()
    .withStreamSource(contentStream)
    .withPolicy(policy)
    .withDisplayFilename(filename)
    .build();

  const ct = await client.encrypt(encryptParams);
  const buff = await streamToBuffer(ct);
  return { content: buff, name: filename };
}

export { encrypt };
