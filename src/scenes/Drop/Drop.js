import React from 'react';
import PropTypes from 'prop-types';
import './Drop.css';
import Share from 'scenes/Share/Share';
import SidebarLogger from '../SidebarLogger/SidebarLogger';
import tdf3 from '../../utils/tdfWrapper';
import Store from '../../store';

/**
 * A place to drop an encrypted or uncrypted file.
 */
class Drop extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  processFile(fileOb, completion) {
    const reader = new FileReader();
    const filename = fileOb.name;
    const shouldEncrypt = !filename.endsWith('.tdf');
    const { userId, store } = this.props;

    reader.onload = async e => {
      try {
        console.log(
          (shouldEncrypt ? 'En' : 'De') + 'crypt a file: [' + filename + '] for ' + userId,
        );
        tdf3.encrypt({ filename, store, userIds: [userId] });
        // await encryptOrDecryptFile(reader.result, filename, shouldEncrypt, userId, completion);
      } catch (e) {
        if (shouldEncrypt) {
          alert(
            'An error occurred attempting to encrypt this file. Please be sure you have authenticated, and try again.',
          );
        } else {
          alert(
            'An error occurred attempting to decrypt this file. Please be sure you have access to do so.',
          );
        }
      }
    };

    reader.readAsArrayBuffer(fileOb);
  }

  processFiles(files, index) {
    const i = index || 0;
    if (i >= files.length) {
      return;
    }
    this.processFile(files[i], () => {
      this.processFiles(files, i + 1);
    });
  }

  handleDrop = event => {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    this.processFiles(files);
  };

  handleDrag = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  handleDragEnter = event => {
    if (event.target.id === 'dropzone') {
      event.target.classList.add('Drop-hover');
    }
  };

  handleDragLeave = event => {
    if (event.target.id === 'dropzone') {
      event.target.classList.remove('Drop-hover');
    }
  };

  render() {
    return (
      <>
        <SidebarLogger />
        <div className="Drop-wrapper">
          <div
            className="Drop"
            id="dropzone"
            onDrop={this.handleDrop}
            onDragOver={this.handleDrag}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
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
          <Share />
        </div>
      </>
    );
  }
}

export default Store.withStore(Drop);
