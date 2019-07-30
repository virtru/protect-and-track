import React, { useState } from 'react';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from 'utils/download';

import './DownloadModal.css';

export default ({ onClose, encrypted, virtruClient }) => {
  const [decrypting, setDecrypting] = useState(false);

  const decryptAndDownload = async () => {
    setDecrypting(true);
    await downloadDecrypted({ encrypted, virtruClient });
    setDecrypting(false);
  };

  return (
    <div className="download-modal">
      <Modal onClose={onClose}>
        <h4 className="download-title">Download File</h4>
        <span>Share with others:</span>
        <br />
        <Button fullWidth onClick={() => downloadHtml(encrypted)}>
          Download HTML
        </Button>
        <span>Inspect the metadata:</span>
        <br />
        <Button fullWidth onClick={() => downloadTdf(encrypted)}>
          Download TDF
        </Button>
        <span>See the original file:</span>
        <br />
        <Button
          disabled={decrypting}
          fullWidth
          variant="alternateButton"
          onClick={decryptAndDownload}
        >
          {decrypting ? 'Decrypting...' : 'Decrypt and Download'}
        </Button>
      </Modal>
    </div>
  );
};
