export function restoreUserId(oidcConfig) {
  const key = `virtru-oidc:user:${oidcConfig.storageKeyUniqueId}`;
  const oidcUser = localStorage.getItem(key);
  console.log({ [key]: oidcUser });
  if (!oidcUser) {
    return null;
  }
  const oidcDetails = JSON.parse(oidcUser);
  return oidcDetails.userId;
}
