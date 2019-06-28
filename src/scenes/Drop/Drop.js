import React from 'react';
import './Drop.css';
import PolicyPanel from 'scenes/Policy/Policy';
import Share from 'scenes/Share/Share';
import Store from '../../store';

/**
 * A place to drop an encrypted or uncrypted file.
 */
function Drop({ userId }) {
  const store = Store.useStore();
  const appIdBundle = store.get('appIdBundle');
  console.log(appIdBundle);

  // Asyncify FileReader's `readAsArrayBuffer`.
  const fileToArrayBuffer = file => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException(file));
      };

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async fileHandle => {
    const filename = fileHandle.name;
    const shouldEncrypt = !filename.endsWith('.tdf');

    const fileBuffer = await fileToArrayBuffer(fileHandle);
    console.log(
      (shouldEncrypt ? 'En' : 'De') +
        'crypt a file: [' +
        filename +
        '] for ' +
        userId +
        ' as ' +
        fileBuffer,
    );
    store.set('file')({ file: fileHandle, arrayBuffer: fileBuffer });
  };

  const handleDrop = async event => {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (const file of files) {
      await processFile(file);
    }
  };

  const handleDrag = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  const handleDragEnter = event => {
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  const handleDragLeave = event => {
    if (event.target.id === 'dropzone') {
      event.target.classList.remove('Drop-hover');
    }
  };

  function DropZone() {
    return (
      <div
        className="Drop"
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="Drop-box">
          <svg className="Drop-icon" width="100" height="93" viewBox="0 0 50 43">
            <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
          </svg>
        </div>
        <h2 className="Drop-text">
          Drag a document here to encrypt
          <br /> or a TDF to modify its policy
        </h2>
      </div>
    );
  }

  if (!store.get('file')) {
    return <DropZone />;
  }
  return (
    <>
      <PolicyPanel />
      <Share />
    </>
  );
}

export default Drop;
