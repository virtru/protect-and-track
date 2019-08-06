# Protect and Track Demo

![Protect and Track](https://files.readme.io/b99c6e4-protect-share-5.png)

The Protect and Track Demo leverages the [Virtru JavaScript SDK](https://docs.developer.virtru.com/js/latest/index.html) as well as the [TDF Architecture](https://developer.virtru.com/docs/tdf-overview) in order to secure files and share them with others, while maintaining visibility and control of your data.

This demo showcases features such as:

- Securing a file such that only intended recipients can access its data
- Sharing a secured file with others, using Google Drive, or Dropbox
- Revoking access to a secured file, so users can no longer access its data

## See it Live

[Go here](https://demos.developer.virtru.com/protect/) to test drive the live demo. Afterwards, check the out Virtru's [Developer Hub](https://developer.virtru.com/docs/protect) for a step-by-step guide on how it all works.

## Run it Locally

If you want to run this demo locally, ensure that you have met the following pre-reqs:

- Node/NPM - Node and NPM are both requirements to build and run the example
- If you are running this example locally from a Windows machine, please ensure you use a POSIX-compatible environment such as Cygwin.
- Ensure that your `/etc/hosts` file includes the following line: `127.0.0.1 local.virtru.com` to avoid running into CORs errors

Now get it running:

```console
foo@bar:~$ git clone git@github.com:virtru/protect-and-track.git # Clone this repository
foo@bar:~$ npm ci; sudo npm start # Install and run locally
```

If running successfully, visit `https://local.virtru.com` and use the demo running from your computer.

## Getting Help

There are many ways to get our attention:

- You can [join](https://docs.google.com/forms/d/e/1FAIpQLSfCx5tSl9hGQSZ-H-ZIzNw6uWIPN3_HSpMtYssKQ9jytj9yQQ/viewform) Virtru's Developer Hub Community Slack channel to get your questions answered.
- You can open a support ticket [here](https://support.virtru.com/hc/en-us/requests/new?ticket_form_id=360001419954).
