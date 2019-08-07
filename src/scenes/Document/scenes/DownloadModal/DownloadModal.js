// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { useEffect, useState } from 'react';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { downloadHtml, downloadTdf, downloadDecrypted } from 'utils/download';

import './DownloadModal.css';
import '../LoadingModal/LoadingModal.css';

import PolicyUtils from 'utils/policy';

export default ({ onClose, encrypted, virtruClient }) => {
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
