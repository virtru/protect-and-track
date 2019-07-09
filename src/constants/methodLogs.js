export const clientIntialize = () => 'const client = require("tdf3-js")();';
export const initEncryptParams = () => 'const encryptParams = new TDF.EncryptParamsBuilder();';
export const setFilename = filename => `encryptParams.withFileSource(${filename});`;
export const setPermisions = permisions =>
  `encryptParams.withDissem(${JSON.stringify(permisions)});`;
export const finilizeEncryptParams = () => 'encryptParams.build();';
export const encryptRequest = () => 'await client.encrypt(encryptParams);';
