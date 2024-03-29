import React, { useEffect, useState } from 'react';

import { Modal } from '../../../../components/Modal/Modal';
import { Button } from '../../../../components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from '../../../../utils/download';

import './DownloadModal.css';
import '../LoadingModal/LoadingModal.css';

import { policyFlagCheck } from '../../../../utils/policy';

export const DownloadModal = ({ onClose, encrypted, virtruClient }) => {
  const [decrypting, setDecrypting] = useState(false);

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
          <Button fullWidth onClick={() => downloadHtml(encrypted)}>
            Download HTML
          </Button>
          <span>Inspect the metadata:</span>
          <br />
          <Button fullWidth onClick={() => downloadTdf(encrypted)}>
            Download TDF
          </Button>
        </Modal>
      </div>
    );
  };

  const showDecryptAndDownloadModal = () => {
    const decryptAndDownload = async () => {
      setDecrypting(true);
      try {
        await downloadDecrypted({ encrypted, virtruClient });
      } catch (err) {
        console.error(err);
        alert('File could not be decrypted');
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
      policyFlagCheck({ encrypted, virtruClient }).then((res) => {
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
