// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
        return function(...args) {
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
