import React, { useState, useEffect } from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative } from 'components/FormBox/FormBox';
import './Share.css';
import { init as shareable, upload as uploadToDrive } from './services/gsuite';

/* global gapi */

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function Share() {
  const [shareState, setShareState] = useState('unshared');
  const [data, setData] = useState({ status: 'loading', files: [] });

  // Run this periodically or after uploading a file
  const list = async () => {
    const response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    });
    setData({files: response.result.files});
  };

  useEffect(() => {
    async function startShare() {
      await shareable();
      
      const resetAuthButtons = async () => {
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        setData({ status: (signedIn ? '' : 'un') + 'authorized' });
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

  const authorize = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const upload = async () => {
    setShareState('sharing');
    const response = await uploadToDrive('helloworld.txt', 'text/plain', 'Hello World!');
    // if we need to debug the spinner add this
    // await sleep(4000);
    setShareState('shared');
    console.log(response);
    list();
  };

  function ShareButton() {
    return <>
      <FormBoxInstruction>Write a simple file to drive</FormBoxInstruction>
      <button id="upload_button"
              className="Share-upload-google"
              onClick={upload}>upload</button>
    </>;
  }

  function ShareUploading() {
    return <div className="Share-file-uploading"></div>;
  }

  function ShareDone(props) {
    return <div className="Share-done">{ props.children }</div>;
  }

  function ShareStatus() {
    console.log('ShareStatus: ' + JSON.stringify(shareState));
    switch (shareState) {
      case 'unshared': return <ShareButton />;
      case 'sharing': return <ShareUploading />;
      // TODO(dmihalcik): link to drive folder.
      case 'shared': return <ShareDone>DONE</ShareDone>;
      default: return <h3>shareState = [{shareState}]</h3>;
    }
  }

  function renderButton() {
    return data.status === 'loading'
          ? <FormBoxAlternative>loading...</FormBoxAlternative>
        : data.status === 'unauthorized'
          ? <button id="authorize"
                    className="Share-authorize-google"
                    onClick={authorize}>Authorize</button>
          : 
            <>
              <ShareStatus share={data.share} />
              <FormBoxAlternative>Or</FormBoxAlternative>
              <button id="signout_button"
                      className="Share-signout-google"
                      onClick={signOut}>Sign Out</button>
            </>;
  }

  return (
    <FormBox title="Sharing Provider Tool" onSubmit={ e => { e.preventDefault(); } }>
      { renderButton() }
      {data.files && data.files.length &&
        <pre>
          {
            data.files.map((file) =>
              <>
                {file.name + '\n'}
              </>
            )
          }
        </pre>
      }
    </FormBox>
  );
}

export default Share;
