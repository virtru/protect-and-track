import React from 'react';

import Button from 'components/Button/Button';
import './Filename.css';

function Filename({ encrypted, file, setFile }) {
  let name, suffix;
  if (encrypted) {
    const i = encrypted.name.lastIndexOf('.');
    name = encrypted.name.substring(0, i);
    suffix = encrypted.name.substring(i);
  } else {
    name = file.name;
  }
  return (
    <h2 className="Filename">
      {name}
      {suffix && <span className="Filename-tdf">{suffix}</span>}
      <Button variant="link" onClick={e => setFile({})} small>
        Start over
      </Button>
    </h2>
  );
}

export default Filename;
