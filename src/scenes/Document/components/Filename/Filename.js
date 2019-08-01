import React from 'react';

import Button from 'components/Button/Button';
import './Filename.css';

function Filename({ file, isTdf, setFile }) {
  return (
    <h2 className="Filename">
      {file.file.name}
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      <Button variant="link" onClick={e => setFile({})} small>
        Start over
      </Button>
    </h2>
  );
}

export default Filename;
