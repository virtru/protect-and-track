import React, { useState } from 'react';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from 'utils/download';
import { analytics, EVENT_NAMES } from '../../../../utils/analytics';

import './DownloadModal.css';

const DOWNLOAD_TYPES = {
  FILE: 'file',
  TDF: 'tdf',
  TDF_HTML: 'tdf.html',
};

export default ({ onClose, encrypted, virtruClient }) => {
  const [decrypting, setDecrypting] = useState(false);

  /** Track Download Metrics for Amplitude */
  const trackDownload = (event, extension = DOWNLOAD_TYPES.FILE, isSecure = false) => {
    console.log(`Tracking ${event}`);
    analytics.track({
      event,
      properties: {
        fileType: encrypted.type,
        fileSize: `${encrypted.payload.byteLength / 1000}KB`,
        'policy.type': 'file',
        extension,
        isSecure,
      },
    });
  };

  const decryptAndDownload = async () => {
    setDecrypting(true);
    trackDownload(EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT);
    try {
      await downloadDecrypted({ encrypted, virtruClient });
      trackDownload(EVENT_NAMES.FILE_DOWNLOAD_COMPLETE);
    } catch (err) {
      console.error(err);
      trackDownload(EVENT_NAMES.FILE_DOWNLOAD_ERROR);
      alert('File could not be decrypted');
    } finally {
      setDecrypting(false);
    }
  };

  const downloadAsHtml = () => {
    trackDownload(EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT, DOWNLOAD_TYPES.TDF_HTML, true);
    downloadHtml(encrypted);
    trackDownload(EVENT_NAMES.FILE_DOWNLOAD_COMPLETE, DOWNLOAD_TYPES.TDF_HTML, true);
  };

  const downloadAsTdf = () => {
    trackDownload(EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT, DOWNLOAD_TYPES.TDF, true);
    downloadTdf(encrypted);
    trackDownload(EVENT_NAMES.FILE_DOWNLOAD_COMPLETE, DOWNLOAD_TYPES.TDF, true);
  };

  return (
    <div className="download-modal">
      <Modal onClose={onClose}>
        <h4 className="download-title">Download File</h4>
        <span>Share with others:</span>
        <br />
        <Button fullWidth onClick={downloadAsHtml}>
          Download HTML
        </Button>
        <span>Inspect the metadata:</span>
        <br />
        <Button fullWidth onClick={downloadAsTdf}>
          Download TDF
        </Button>
        <span>See the original file:</span>
        <br />
        <Button
          disabled
          // disabled={decrypting} -- re-enable when this is working
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
