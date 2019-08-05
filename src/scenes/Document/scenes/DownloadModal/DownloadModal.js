import React, { useEffect, useState } from 'react';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from 'utils/download';
import { EVENT_NAMES, trackDownload } from 'utils/analytics';

import './DownloadModal.css';
import '../LoadingModal/LoadingModal.css';

import PolicyUtils from 'utils/policy';

const DOWNLOAD_TYPES = {
  FILE: 'file',
  TDF: 'tdf',
  TDF_HTML: 'tdf.html',
};

export default ({ onClose, encrypted, virtruClient }) => {
  const [decrypting, setDecrypting] = useState(false);

  /** Track Download Metrics for Amplitude */
  const downloadAsHtml = () => {
    trackDownload({
      event: EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT,
      extension: DOWNLOAD_TYPES.TDF_HTML,
      isSecure: true,
      encrypted,
    });
    try {
      downloadHtml(encrypted);
      trackDownload({
        event: EVENT_NAMES.FILE_DOWNLOAD_COMPLETE,
        extension: DOWNLOAD_TYPES.TDF_HTML,
        isSecure: true,
        encrypted,
      });
    } catch (error) {
      trackDownload({
        event: EVENT_NAMES.FILE_DOWNLOAD_ERROR,
        name: error.name,
        message: error.message,
        stack: error.stack,
        encrypted,
      });
    }
  };

  const downloadAsTdf = () => {
    trackDownload({
      event: EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT,
      extension: DOWNLOAD_TYPES.TDF,
      isSecure: true,
      encrypted,
    });
    try {
      downloadTdf(encrypted);
      trackDownload({
        event: EVENT_NAMES.FILE_DOWNLOAD_COMPLETE,
        extension: DOWNLOAD_TYPES.TDF,
        isSecure: true,
        encrypted,
      });
    } catch (error) {
      trackDownload({
        event: EVENT_NAMES.FILE_DOWNLOAD_ERROR,
        name: error.name,
        message: error.message,
        stack: error.stack,
        encrypted,
      });
    }
  };

  const showDecryptModal = () => {
    return (
      <div className="download-modal">
        <Modal onClose={onClose}>
          <h1>Download File</h1>
          <h2 className="download-subtitle">
            Download this file and open in{' '}
            <a
              href="https://secure.virtru.com/secure-reader"
              target="_blank"
              rel="noopener noreferrer"
            >
              Secure Reader{' '}
            </a>
          </h2>
          <span>Share with others:</span>
          <br />
          <Button fullWidth onClick={() => downloadAsHtml()}>
            Download HTML
          </Button>
          <span>Inspect the metadata:</span>
          <br />
          <Button fullWidth onClick={() => downloadAsTdf()}>
            Download TDF
          </Button>
        </Modal>
      </div>
    );
  };

  const showDecryptAndDownloadModal = () => {
    const decryptAndDownload = async () => {
      setDecrypting(true);
      trackDownload({ event: EVENT_NAMES.FILE_DOWNLOAD_ATTEMPT, encrypted });
      try {
        await downloadDecrypted({ encrypted, virtruClient });
        trackDownload({ event: EVENT_NAMES.FILE_DOWNLOAD_COMPLETE, encrypted });
      } catch (error) {
        console.error(error);
        alert('File could not be decrypted');
        trackDownload({
          event: EVENT_NAMES.FILE_DOWNLOAD_ERROR,
          name: error.name,
          message: error.message,
          stack: error.stack,
          encrypted,
        });
      } finally {
        setDecrypting(false);
      }
    };

    return (
      <div className="download-modal">
        <Modal onClose={onClose}>
          <h1>Download File</h1>
          <span>Share with others:</span>
          <br />
          <Button fullWidth onClick={() => downloadAsHtml()}>
            Download HTML
          </Button>
          <span>Inspect the metadata:</span>
          <br />
          <Button fullWidth onClick={() => downloadAsTdf()}>
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

  const showLoadingModal = () => {
    return (
      <div className="loading-modal">
        <Modal>
          <h1>Loading Policy</h1>
          <span>Loading the policy associated to this file...</span>
          <br />
        </Modal>
      </div>
    );
  };

  const DetermineModal = () => {
    const [whichModal, setWhichModal] = useState(null);

    useEffect(() => {
      PolicyUtils.policyFlagCheck({ encrypted, virtruClient }).then(res => {
        setWhichModal(res);
      });
    });

    switch (whichModal) {
      case null:
        return showLoadingModal();
      case true:
        return showDecryptModal();
      case false:
        return showDecryptAndDownloadModal();
      default:
        return showLoadingModal();
    }
  };

  return DetermineModal();
};
