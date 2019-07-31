const auditUrl = 'https://audit.virtru.com/api/messages';

// TODO: Replace with SDK
const buildAuditReq = policyId => `${auditUrl}?sort=timestamp:asc&objectId=${policyId}`;

export async function getAuditEvents({ userId, appId, policyId }) {
  return fetch(buildAuditReq(policyId), {
    headers: {
      Authorization: `Virtru [["${appId}","${userId}"]]`,
      'Accept-Version': 'v2',
    },
  });
}
