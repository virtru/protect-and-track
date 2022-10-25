import { bindActions } from 'redux-zero/utils';
import moment from 'moment';
import store from '../store';

const boundActions = bindActions(
  {
    pushLogAction: ({ tdfLog }, value) => {
      const newLog = [...tdfLog, value];
      localStorage.setItem('virtru-demo-sdk-log', JSON.stringify(newLog));
      return { tdfLog: newLog };
    },
  },
  store,
);

const actionList = {
  loginWithRedirect: {
    title: 'Sign In',
    code: 'oidcClient.loginWithRedirect(IdentityProvider.Google)',
  },

  existingPolicyBuilder: {
    title: 'Get Policy Builder',
    code: 'const builder = existingPolicy.builder();',
  },
  createPolicyBuilder: {
    title: 'Create Policy Builder',
    code: 'const builder = new Virtru.PolicyBuilder();',
  },
  buildVirtruPolicy: {
    title: 'Build Virtru Policy',
    code: ['const policy = builder'],
  },
  buildVirtruEncryptionParams: {
    title: 'Build Virtru Encryption Params',
    code: [
      'const encryptParams = new Virtru.EncryptParamsBuilder()',
      '  .withBufferSource(buffer)',
      '  .withPolicy(policy)',
      '  .withDisplayFilename(filename)',
      '  .withMimeType(contentType)',
      '  .build();',
    ],
  },
  createClient: {
    title: 'Create Client',
    code: `const Client = new Virtru.Client();`,
  },
  createClientWithEmail: {
    title: 'Create Client',
    code: `const Client = new Virtru.Client({ email }});`,
  },
  createDecryptParams: {
    title: 'Create Decrypt Params',
    code: [
      'const decryptParams = new Virtru.DecryptParamsBuilder()',
      '  .withBufferSource(encryptedBuffer)',
      '  .build();',
    ],
  },
  decryptFile: {
    title: 'Decrypt File',
    code: [
      'const decryptStream = await virtruClient.decrypt(decryptParams);',
      'const decryptBuffer = await decryptStream.toBuffer();',
    ],
  },
  encryptToBuffer: {
    title: 'Encrypt to Buffer',
    code: [
      'const encryptedStream = await client.encrypt(encryptParams);',
      'const encryptedFile = await encryptedStream.toBuffer();',
    ],
  },
  revokePolicy: {
    title: 'Revoke Policy',
    code: 'client.revokePolicy(policyId);',
  },
  unwrapHtml: {
    title: 'Unwarap HTML TDF',
    code: 'window.TDF.unwrapHtml(file);',
  },
  updatePolicy: {
    title: 'Update Policy',
    code: `client.updatePolicy(policy);`,
  },
};

export function builderLogger(builder) {
  let actions = [];
  return new Proxy(builder, {
    get(target, propKey, receiver) {
      const origMethod = target[propKey];
      if (origMethod) {
        return function (...args) {
          // Add the next action
          actions.push(`    .${propKey}(${args.length ? JSON.stringify(args) : ''})`);

          // Log the final command
          if (propKey === 'build') {
            virtruActionLogger('buildVirtruPolicy', actions);
          }

          return origMethod.apply(target, args);
        };
      }
      return origMethod;
    },
  });
}

export default function virtruActionLogger(action, code) {
  if (actionList[action]) {
    const actionItem = { ...actionList[action] };

    // Convert to an arry so we can append
    if (!Array.isArray(actionItem.code)) {
      actionItem.code = [actionItem.code.toString()];
    }

    // If code is defined then append it to the predefined code
    if (Array.isArray(code) || typeof code === 'string') {
      if (typeof code === 'string') {
        code = [code];
      }
      actionItem.code = [...actionItem.code, ...code];
    }

    // Join the items with newlines
    actionItem.code = actionItem.code.join('\r\n');

    // Log the action
    boundActions.pushLogAction({ ...actionItem, timestamp: moment() });
  } else {
    throw new Error(`Action ${action} was not defined in the action list for Virtru Action Logger`);
  }
}
