import React from 'react';
import './Drop.css';
import { ReactComponent as DropIcon } from './drop-icon.svg';
import tdfWrapper from 'utils/tdfWrapper';

/**
 * A place to drop an encrypted or uncrypted file.
 */
function Drop({ children, userId, updateFile }) {
  console.log(`<Drop userId="${userId}">`);

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
    const verb = (shouldEncrypt ? 'En' : 'De') + 'crypt';
    console.log(`${verb} a file [${filename}] for [${userId}] as [${fileBuffer}]`);
    updateFile({ file: fileHandle, arrayBuffer: fileBuffer });
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

  function DropZone({ children }) {
    return (
      <div
        className="Drop"
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {children}
      </div>
    );
  }

  function EmptyTarget() {
    return (
      <>
        <div className="Drop-box">
          <DropIcon className="Drop-icon" />
        </div>
        <h2 className="Drop-text">
          Drag a document here to encrypt
          <br /> or a TDF to modify its policy
        </h2>
      </>
    );
  }

  if (!children) {
    return (
      <DropZone>
        <EmptyTarget />
      </DropZone>
    );
  }
  return <DropZone>{children}</DropZone>;
}

export default Drop;
