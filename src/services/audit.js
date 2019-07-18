// TODO: Replace with SDK

const auditUrl = policyId =>
  `https://audit-develop01.develop.virtru.com/api/messages?sort=timestamp:asc&objectId=${policyId}`;

export async function getAuditEvents({ userId, appId, policyId }) {
  return fetch(auditUrl(policyId), {
    headers: {
      Authorization: `Virtru [["${appId}","${userId}"]]`,
      'Accept-Version': 'v2',
    },
  });
}
