import React, { useState, useEffect } from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative } from 'components/FormBox/FormBox';
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

  const upload = async () => {
    // NOTE(DSAT-1): Unfortunately, AFAICT the current `drive.files.create` method in GAPI
    // does not support POST content. See relevant discussions:
    //   * https://stackoverflow.com/questions/51775917
    //   * https://stackoverflow.com/questions/34905363
    //
    // Instead, create a gapi `request` explicitly for the following POST:
    //   * https://developers.google.com/drive/api/v3/reference/files/create
    function makeRequest(name, contentType, content) {
      const boundary = '-------34905363';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";
      const metadata = {
        'name': name,
        'mimeType': contentType,
      };
      const multipartRequestBody =
          delimiter
              + 'Content-Type: application/json\r\n\r\n'
              + JSON.stringify(metadata)
              + delimiter
              + 'Content-Type: ' + contentType
              + '\r\n\r\n'
              + content
              + close_delim;

      return {
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody,
      };
    };

    const response = await gapi.client.request(makeRequest('helloworld.txt', 'text/plain', 'Hello World!'));
    console.log(response);
  };

  function renderButton() {
    return data.status === 'loading'
          ? <FormBoxAlternative>loading...</FormBoxAlternative>
        : data.status === 'unauthorized'
          ? <button id="authorize"
                    className="Share-authorize-google"
                    onClick={authorize}>Authorize</button>
          : 
            <>
              <FormBoxInstruction>Write a simple file to drive</FormBoxInstruction>
              <button id="upload_button"
                      className="Share-upload-google"
                      onClick={upload}>upload</button>
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
