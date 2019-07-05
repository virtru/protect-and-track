import React from 'react';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
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
        <div class="Document-details">
          <Filename file={file} />
          <Policy file={file} />
        </div>
      </Drop>
      {/* TODO(DSAT-17): make this modal */}
      <Share file={file} />
    </>
  );
}

export default Document;
