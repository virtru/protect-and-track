import Virtru from 'virtru-sdk';
import { TDF } from 'tdf3-js';
import { bindActions } from 'redux-zero/utils';
import moment from 'moment';

import * as logs from 'constants/methodLogs';
import store from '../store';

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

const actions = {
  pushLogAction: ({ tdfLog }, value) => ({ tdfLog: [...tdfLog, value] }),
  // @todo remove hardcode, audit events should be pushed from api
  fetchAuditLogAction: () => ({
    auditLog: [
      {
        auditDataType: 'FILE.ACCESS_SUCCEEDED',
        userId: 'foo@bar.com',
        timestamp: '2019-07-15T14:48:22+00:00',
        recordId: 0,
      },
      {
        auditDataType: 'FILE.ACCESS_SUCCEEDED',
        userId: 'foo@bar.com',
        timestamp: '2019-07-15T14:48:22+00:00',
        recordId: 1,
      },
    ],
  }),
};

const boundActions = bindActions(actions, store);

function _pushAction(action) {
  action.timestamp = moment();
  boundActions.pushLogAction(action);
}

/**
 * Wrapper for `new Virtru.PolicyBuilder(opts)`.
 *
 * @param {?object} opts
 */
function policyBuilder(opts) {
  const builder = new Virtru.PolicyBuilder(opts);
  let actions = [`const policy = new Virtru.PolicyBuilder(${opts ? 'policy' : ''})`];
  // This proxy records all calls, then logs them to the UI on `build` invocations.
  return new Proxy(builder, {
    get(target, propKey, receiver) {
      const origMethod = target[propKey];
      if (!origMethod) {
        return origMethod;
      }
      return function(...args) {
        if ('build' === propKey) {
          actions.push('    .build()');
          _pushAction({
            title: 'Build Virtru Policy',
            code: actions.join('\r\n'),
          });
        } else {
          actions.push(`    .${propKey}(${args.length ? JSON.stringify(args) : ''})`);
        }
        const result = origMethod.apply(target, args);
        return result;
      };
    },
  });
}

/**
 * Encrypt a file given a policy.
 *
 * @param {Buffer} fileData
 * @param {String} filename
 * @param {String} userEmail
 * @param {Boolean} asHtml
 * @param {Policy} policy
 */
async function encrypt({ client, fileData, filename, userEmail, asHtml, policy }) {
  const buffer = new Uint8Array(fileData);
  _pushAction({
    title: 'Build Virtru Encryption Params',
    code: logs.buildEncryptParams(filename),
  });
  const encryptParams = new Virtru.EncryptParamsBuilder()
    .withBufferSource(buffer)
    .withPolicy(policy)
    .withDisplayFilename(filename)
    .build();

  _pushAction({
    title: 'Encrypt File',
    code: logs.encryptFile(encryptParams),
  });
  const encryptedStream = await client.encrypt(encryptParams);
  const encryptedFile = await encryptedStream.toBuffer();

  boundActions.fetchAuditLogAction();

  return {
    encryptedFile: encryptedFile,
    policyId: policy._policyId,
  };
}

function updatePolicy(client, policy) {
  _pushAction({
    title: 'Update Policy',
    code: `client.updatePolicy(policy);`,
  });
  return client.updatePolicy(policy);
}

function unwrapHtml(file) {
  _pushAction({
    title: 'Load TDF',
    code: logs.unwrapHtml(),
  });
  return TDF.unwrapHtml(file);
}

async function decrypt({ virtruClient, encryptedFile }) {
  const decryptParams = new Virtru.Client.VirtruDecryptParamsBuilder()
    .withBufferSource(encryptedFile)
    .build();

  const content = await virtruClient.decrypt(decryptParams);
  const buff = await streamToBuffer(content);
  return buff;
}

function createClient({ email }) {
  // TODO logger here
  console.log(email);
  return new Virtru.Client({ email });
}

export default {
  encrypt,
  policyBuilder,
  updatePolicy,
  unwrapHtml,
  decrypt,
  createClient,
};
