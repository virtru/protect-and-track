import React from 'react';

import './Filename.css';

function Filename({ file, isTdf, setFile }) {
  return (
    <h2 className="Filename">
      {file.file.name}
      {isTdf && <span className="Filename-tdf">.tdf</span>}
      <label className="Filename-Replace">
        Replace file...
        <input
          type="file"
          id="replace"
          name="replace[]"
          onChange={event => {
            event.stopPropagation();
            event.preventDefault();

            const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            for (const file of files) {
              setFile(file);
              // TODO(DSAT-45) Handle more than one file, or don't
              return;
            }
          }}
        />
      </label>
    </h2>
  );
}

export default Filename;
