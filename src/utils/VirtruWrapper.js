import Virtru from 'virtru-sdk';
import { TDF } from 'tdf3-js';
import uuid from 'uuid';
import { bindActions } from 'redux-zero/utils';
import moment from 'moment';

import store from '../store';

const actions = {
  pushLogAction: ({ tdfLog }, value) => {
    const newLog = [...tdfLog, value];
    localStorage.setItem('virtru-demo-sdk-log', JSON.stringify(newLog));
    return { tdfLog: newLog };
  },
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
function policyBuilder(existingPolicy) {
  let builder;
  if (existingPolicy) {
    _pushAction({
      title: 'Get Policy Builder',
      code: 'const builder = existingPolicy.builder();',
    });
    builder = existingPolicy.builder();
  } else {
    _pushAction({
      title: 'Create Policy Builder',
      code: 'const builder = new Virtru.PolicyBuilder();',
    });
    builder = new Virtru.PolicyBuilder().withPolicyId(uuid.v4());
  }
  let actions = ['const policy = builder'];
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
    code:
      'const encryptParams = new Virtru.EncryptParamsBuilder()\n' +
      '  .withBufferSource(buffer)\n' +
      '  .withPolicy(policy)\n' +
      '  .withDisplayFilename(filename)\n' +
      '  .build();',
  });
  const encryptParams = new Virtru.EncryptParamsBuilder()
    .withBufferSource(buffer)
    .withPolicy(policy)
    .withDisplayFilename(filename)
    .build();

  _pushAction({
    title: 'Encrypt to Buffer',
    code:
      'const encryptedStream = await client.encrypt(encryptParams);\n' +
      'const encryptedFile = await encryptedStream.toBuffer();',
  });
  const encryptedStream = await client.encrypt(encryptParams);
  const encryptedFile = await encryptedStream.toBuffer();

  const policyId = encryptParams.getPolicyId();

  return {
    encryptedFile,
    policyId,
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
    title: 'Unwrap HTML TDF',
    code: 'TDF.unwrapHtml(file);',
  });
  return TDF.unwrapHtml(file);
}

async function decrypt({ virtruClient, encryptedBuffer }) {
  _pushAction({
    title: 'Create Decrypt Params',
    code:
      'const decryptParams = new Virtru.DecryptParamsBuilder()\n' +
      '  .withBufferSource(encryptedBuffer)\n' +
      '  .build();',
  });
  const decryptParams = new Virtru.DecryptParamsBuilder()
    .withArrayBufferSource(encryptedBuffer)
    .build();

  _pushAction({
    title: 'Decrypt File',
    code:
      'const decryptStream = await virtruClient.decrypt(decryptParams);\n' +
      'const decryptBuffer = await decryptStream.toBuffer();',
  });
  const decryptStream = await virtruClient.decrypt(decryptParams);
  const decryptBuffer = await decryptStream.toBuffer();
  return decryptBuffer;
}

function createClient({ email }) {
  _pushAction({
    title: 'Create Client',
    code: `const Client = new Virtru.Client(${email ? '{ email }' : ''});`,
  });
  if (!email) {
    return new Virtru.Client();
  }
  return new Virtru.Client({ email });
}

function revoke({ virtruClient, policyId }) {
  _pushAction({
    title: 'Revoke Policy',
    code: 'client.revokePolicy(policyId);',
  });
  return virtruClient.revokePolicy(policyId);
}

function newVirtruDecryptParamsBuilder(opts) {
  return new Virtru.DecryptParamsBuilder(opts);
}

async function signOut(userId) {
  const resetApp = () => {
    localStorage.removeItem('virtru-demo-email');
    localStorage.removeItem('virtru-demo-file');
    localStorage.removeItem('virtru-demo-policy');
    localStorage.removeItem('virtru-demo-sdk-log');
    localStorage.removeItem('virtru-demo-login-tracked');
    window.location = window.location.href.split(/[?#]/)[0];
  };
  if (userId) {
    await Virtru.Auth.logout({ email: userId });
    resetApp();
  } else {
    resetApp();
  }
}

function fetchAuditEvents({ virtruClient, policyId }) {
  // Not logging this since it happens so often
  return virtruClient.fetchEventsForPolicyId(policyId);
}

export default {
  encrypt,
  policyBuilder,
  updatePolicy,
  unwrapHtml,
  decrypt,
  createClient,
  revoke,
  newVirtruDecryptParamsBuilder,
  signOut,
  fetchAuditEvents,
};
