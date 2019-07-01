import React from 'react';

import './SidebarItem.css';

export default () => (
  <div className="SidebarItemWrapper">
    <div className="json-wrapper">
      <div className="showPayload">Show payload</div>
      <pre className="prettyprint">
        {`
const client = require("tdf3-js")();

async function encrypt(filename){
    // Prepare the parameters for encryption, specifying the plaintext file
    // and the users with decrypt access.
    let encryptParams = new TDF.EncryptParamsBuilder()
                                    .withFileSource(filename)
                                    .withDissem(["has-access@secret.org"])
                                    .build();
    // Return the ciphertext read stream for consumption.
    return await client.encrypt(encryptParams);
}
        `}
      </pre>
    </div>
  </div>
);
