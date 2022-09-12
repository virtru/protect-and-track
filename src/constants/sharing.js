// Constants for the share state in the store.
export const SHARE_PROVIDERS = {
  BOX: 'box',
  GOOGLEDRIVE: 'googledrive',
  ONEDRIVE: 'onedrive',
};
export const SHARE_STATE = {
  UNSHARED: 'unshared',
  AUTHORIZING: 'authorizing',
  UPLOADING: 'uploading',
  SHARING: 'sharing',
  SHARED: 'shared',
  FAIL: 'fail',
};
// Text friendly sharing provider names/titles
export const SHARE_TITLES = {
  box: 'box.com',
  googledrive: 'Google Drive',
  onedrive: 'OneDrive',
};
