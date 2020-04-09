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
