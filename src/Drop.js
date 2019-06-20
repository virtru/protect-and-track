import React from 'react';
import './Drop.css';

/**
 * A place to drop an encrypted or uncrypted file.
 */
class Drop extends React.Component {
  handleDrop(event) {
    // TODO(dmihalcik) handleFile
  }
  handleDrag(event) {
    // TODO(dmihalcik) handleFile
  }
  render() {
    return (
      <div className="Drop" id="encrypt_drop_zone" onDrop={this.handleDrop} onDragOver={this.handleDrag}>  
        <div className="Drop-box">
          <svg className="Drop-icon" width="100" height="93" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
          </svg>
        </div>
        <h2 className="Drop-text">Drag a document here to encrypt<br /> or a TDF to modify its policy</h2>
      </div>
    );
  }
}

export default Drop;
