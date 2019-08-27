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

import logAction, { builderLogger } from 'utils/virtruActionLogger';

export const NOPE = 'NOPE';

/**
 * Event handler generator that updates a the policy as a side effect.
 * @param setPolicy the policy setter action
 * @param change function that takes a PolicyBuilder and manipulates it, which an optional `event` second argument
 */
export function generatePolicyChanger(policy, setPolicy, change, policyId) {
  return e => {
    e && e.preventDefault();

    /**** Virtru Block ****
     *
     * The following code shows how to create a new policy and set an id
     * https://docs.developer.virtru.com/js/latest/PolicyBuilder.html
     *
     */

    // Virtru: Get the existing policy builder
    logAction('existingPolicyBuilder');
    let policyBuilder = policy.builder();

    // NOTICE: this is only necessary for this demo
    policyBuilder = builderLogger(policyBuilder);

    // Virtru: Set the policy Id
    policyId && policyBuilder.setPolicyId(policyId);

    if (change(policyBuilder, e) === NOPE) {
      return false;
    }

    // Virtru: Build the new policy
    const newPolicy = policyBuilder.build();
    /**** END Virtru Block ****/

    setPolicy(newPolicy);

    return false;
  };
}
