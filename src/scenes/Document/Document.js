import React from 'react';
import Drop from './scenes/Drop/Drop';
import Policy from './scenes/Policy/Policy';
import Share from 'scenes/Share/Share';

import './Document.css';

function Document({ file, userId }) {
  console.log(`<Document file="${file}" userId="${userId}">`);
  if (!file) {
    return <Drop userId={userId} />;
  }
  return (
    <>
      <Drop userId={userId}>
        <Policy file={file} />
      </Drop>
      {/* TODO(DSAT-17): make this modal */}
      <Share file={file} />
    </>
  );
}

export default Document;
