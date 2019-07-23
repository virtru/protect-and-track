import React from 'react';
import './Drop.css';
import { ReactComponent as DropIcon } from './drop-icon.svg';
import Virtru from 'utils/VirtruWrapper';

/**
 * A place to drop an encrypted or uncrypted file.
 */
function Drop({ children, userId, updateFile, policyState }) {
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
    const fileBuffer = await fileToArrayBuffer(fileHandle);
    // TODO(DSAT-7) handle TDF file and extract policy
    // For now, just load an empty policy here.
    const policyBuilder = Virtru.policyBuilder();
    // Add the current user if present
    if (userId) {
      policyBuilder.addUsers(userId);
    }
    const policy = policyBuilder.build();
    updateFile({ file: fileHandle, arrayBuffer: fileBuffer, policy, policyBuilder });
  };

  const handleFileInput = async event => {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (const file of files) {
      await processFile(file);
      // TODO(DSAT-45) Handle more than one file, or don't
      return;
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

  function DropZone({ children, policyState }) {
    return (
      <div
        className={`Drop Drop-${policyState}`}
        id="dropzone"
        onDrop={handleFileInput}
        onDragOver={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {children}
      </div>
    );
  }

  function UploadButton() {
    return (
      <label className="Drop-UploadButton">
        Choose File
        <input type="file" id="upload" name="upload[]" onChange={handleFileInput} />
      </label>
    );
  }

  function EmptyTarget() {
    return (
      <>
        <div className="Drop-box">
          <DropIcon className="Drop-icon" />
        </div>
        <h2 className="Drop-text">Drag in any regular file to protect it</h2>
        <UploadButton />
        <h3>Or you can drag in a protected file to track and share it</h3>
      </>
    );
  }

  if (!children) {
    return (
      <DropZone policyState="empty">
        <EmptyTarget />
      </DropZone>
    );
  }
  return <DropZone policyState={policyState}>{children}</DropZone>;
}

export default Drop;
