import React from 'react';

import Button from 'components/Button/Button';
import Virtru from 'utils/VirtruWrapper';
import './Filename.css';

function Filename({ file, isTdf }) {
  return (
    <h2 className="Filename">
      {file.file.name}
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      <Button variant="link" onClick={Virtru.signOut} small>
        Start over
      </Button>
    </h2>
  );
}

export default Filename;
