import React from 'react';

import './Filename.css';

function Filename({ file, isTdf }) {
  return (
    <h2 className="Filename">
      {file.file.name}
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      {/* TODO(dmihalcik) File upload link */}
    </h2>
  );
}

export default Filename;
