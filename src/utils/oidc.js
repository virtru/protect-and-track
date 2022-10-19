import * as Virtru from 'virtru-sdk';

export class OidcProvider extends Virtru.VirtruAuthProvider {
  constructor(oidcClient) {
    super();
    this.oidcClient = oidcClient;
  }

  async injectAuth(httpReq) {
    console.log(`injectAuth into ${JSON.stringify(httpReq)}`);
    super.injectAuth(httpReq);
    const user = await this.oidcClient.getUser();
    console.log(`injectAuth injdecting user [${user}]`);
    if (user) {
      httpReq.headers['Authorization'] = `Bearer ${user.accessToken}`;
    }
    const popToken = await this.oidcClient.createRequestSignature(
      /* TODO ADD BACK httpReq.body || */ {},
    );
    console.log(`injectAuth injdecting poptocken [${popToken}]`);
    httpReq.headers['X-Virtru-Signed-Request-Token'] = popToken;
  }

  _getName() {
    return 'OidcProvider';
  }
}

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
