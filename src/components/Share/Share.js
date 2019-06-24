import React, { useState, useEffect } from 'react';
import { FormBox, FormBoxAlternative } from 'components/FormBox/FormBox';
import './Share.css';
import { init as shareable } from './services/gsuite';

/* global gapi */

function Share() {
  const [data, setData] = useState({ status: 'loading', files: [] });

  useEffect(() => {
    async function startShare() {
      await shareable();

      // Run this periodically
      const list = async () => {
        const response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
        });
        setData({files: response.result.files});
      };
      
      const resetAuthButtons = async () => {
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if (signedIn) {
          list();
        }
        setData({
          status: signedIn ? 'authorized' : 'unauthorized'
        });
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

  return (
    <FormBox title="Sharing Provider Tool"
             onSubmit={ e => { e.preventDefault(); } }>
      {
        data.status === 'loading'
          ? <FormBoxAlternative>loading...</FormBoxAlternative>
        : data.status === 'unauthorized'
          ? <button id="authorize"
                    className="Share-authorize-google"
                    onClick={authorize}>Authorize</button>
          : <button id="signout_button"
                    className="Share-signout-google"
                    onClick={signOut}>Sign Out</button>
      }
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
