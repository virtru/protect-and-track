// import * as Virtru from '../../node_modules/virtru-sdk/dist/virtru-sdk.web.min.js';

const Virtru = window.Virtru;

export const getPolicy = async ({ encrypted, virtruClient }) => {
  const decryptParams = new Virtru.DecryptParamsBuilder()
    .withArrayBufferSource(encrypted.payload)
    .build();

  const uuid = await virtruClient.getPolicyId(decryptParams);
  return await virtruClient.fetchPolicy(uuid);
};

export const policyFlagCheck = async ({ encrypted, virtruClient }) => {
  const thePolicy = await getPolicy({ encrypted, virtruClient });
  const policyFlags = thePolicy._authZFlags;
  return policyFlags.watermark === true || policyFlags.pfp === true;
};
