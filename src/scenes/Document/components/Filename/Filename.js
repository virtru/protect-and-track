import React from 'react';

import RevokeAll from '../RevokeAll/RevokeAll';

import Button from 'components/Button/Button';
import Virtru from 'utils/VirtruWrapper';
import './Filename.css';

function Filename({ userId, file, isTdf, isPolicyRevoked, revokePolicy }) {
  return (
    <h2 className="Filename">
      {file.file.name}
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      {isTdf && <RevokeAll isPolicyRevoked={isPolicyRevoked} revokePolicy={revokePolicy} />}
    </h2>
  );
}

export default Filename;
