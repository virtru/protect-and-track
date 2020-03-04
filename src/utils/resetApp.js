import localForage from 'localforage';

export default async function resetApp() {
  localStorage.removeItem('virtru-demo-email');
  await localForage.removeItem('virtru-demo-file');
  await localForage.removeItem('virtru-demo-file-encrypted');
  localStorage.removeItem('virtru-demo-policy');
  localStorage.removeItem('virtru-demo-policyId');
  localStorage.removeItem('virtru-demo-policyRevoked');
  localStorage.removeItem('virtru-demo-sdk-log');
  localStorage.removeItem('virtru-demo-login-tracked');
  window.location = window.location.href.split(/[?#]/)[0];
}
