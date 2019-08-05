import React from 'react';

import RevokeAll from '../RevokeAll/RevokeAll';
import './Filename.css';

function Filename({ userId, file, isTdf, isPolicyRevoked, revokePolicy }) {
  return (
    <h2 className="Filename">
      <span className="Filename-original" title={file.file.name}>
        {file.file.name}
      </span>
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      {isTdf && <RevokeAll isPolicyRevoked={isPolicyRevoked} revokePolicy={revokePolicy} />}
    </h2>
  );
}

export default Filename;
