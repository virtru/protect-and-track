import React, { useState, useEffect } from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative } from 'components/FormBox/FormBox';
import './GoogleDriveShare.css';
import { init as shareable, upload as uploadToDrive } from './services/gsuite';

/* global gapi */

function Share() {
  const [shareState, setShareState] = useState('unshared');
  const [data, setData] = useState({ status: 'loading', files: [] });

  // Run this periodically or after uploading a file
  const list = async () => {
    const response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    });
    setData({status: 'authorized', files: response.result.files});
  };

  useEffect(() => {
    async function startShare() {
      await shareable();
      
      const resetAuthButtons = async () => {
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        setData({
            status: signedIn ? 'authorized' : 'unauthorized'	
        });
        setShareState('unshared');

        if (signedIn) {
          list();
        }
      };
      resetAuthButtons();
      gapi.auth2.getAuthInstance().isSignedIn.listen(resetAuthButtons);
    };
    startShare();
  }, []);

  const authorize = async () => {
    setData({ status: 'loading' });
    await gapi.auth2.getAuthInstance().signIn();
    setData({ status: 'authorized' });
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const upload = async () => {
    setShareState('sharing');
    const response = await uploadToDrive('helloworld.txt', 'text/plain', 'Hello World!');
    setShareState('shared');
    console.log(response);
    list();
  };

  const ShareButton = () =>
      <>
        <FormBoxInstruction>Write a simple file to drive</FormBoxInstruction>
        <button id="upload_button"
                className="Share-upload-google"
                onClick={upload}>upload</button>
      </>;
  const ShareUploading = () =>
      <div className="Share-file-uploading" />;
  const ShareDone = props =>
      <div className="Share-done">{ props.children }</div>;
  const ShareStatus = () => {
    switch (shareState) {
      case 'unshared': return <ShareButton />;
      case 'sharing': return <ShareUploading />;
      // TODO(dmihalcik): link to drive folder.
      case 'shared': return <ShareDone>DONE</ShareDone>;
      default: return <h3>shareState = [{shareState}]</h3>;
    }
  }

  const AuthButton = () =>
      <button id="authorize"
              className="Share-authorize-google"
              onClick={authorize}>
        Authorize
      </button>;
  const AuthLoading = () =>
      <FormBoxAlternative>
        Awaiting authorization...
      </FormBoxAlternative>;
  const ShareOrSignOut = () =>
      <>
        <ShareStatus share={data.share} />
        <FormBoxAlternative>Or</FormBoxAlternative>
        <button id="signout_button"
                className="Share-signout-google"
                onClick={signOut}>Sign Out</button>
      </>;

  const AuthAndShareButton = () => {
    switch (data.status) {
      case 'unauthorized': return <AuthButton />;
      case 'authorized': return <ShareOrSignOut />;
      default: return <AuthLoading />;
    }
  }

  const LastTenFiles = () => 
      (data.files && data.files.length &&
          <pre>
            {
              data.files.map((file) =>
                <>
                  {file.name + '\n'}
                </>
              )
            }
          </pre>)
          || null;

  return (
    <FormBox title="Sharing Provider Tool" onSubmit={ e => { e.preventDefault(); } }>
      <AuthAndShareButton />
      <LastTenFiles />
    </FormBox>
  );
}

export default Share;
