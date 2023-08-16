export function restoreUserId() {
  const key = 'virtru-oidc:user';
  const oidcUser = localStorage.getItem(key);
  console.log({ [key]: oidcUser });
  if (!oidcUser) {
    return null;
  }
  const oidcDetails = JSON.parse(oidcUser);
  return oidcDetails.userId;
}
