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

This demo can run on your local environment. Please ensure you meet the prerequisites and follow the steps.

### Prerequisites

To be able to use Federated OAuth we suggest you to modify your `/etc/hosts`. This is an optional step, but note the fallback authentication will be email code only.

#### Windows

- Install a POSIX-compatible environment such as [Cygwin](https://www.cygwin.com/) or [Cmder](https://cmder.net/)
- Install [NVM](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows)
- Edit `c:\Windows\System32\Drivers\etc\hosts` to include `127.0.0.1 local.virtru.com`

Alternatively you could install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and use the instructions below for Linux

#### Linux / MacOS

- Install [NVM](https://github.com/nvm-sh/nvm#installation-and-update)
- Edit `/etc/hosts` to include `127.0.0.1 local.virtru.com`

### Getting Started

```console
# Clone the repository
$ git clone git@github.com:virtru/protect-and-track.git

# Change directory
$ cd protect-and-track

# Install node via NVM
$ nvm use

# Install node modules
$ npm ci

# Start the node server
$ sudo npm start
```

If running successfully, your default browser may automatically open. If not visit `https://local.virtru.com`.

---

You may be presented with a warning screen with a message similar to "Your connection is not private." This is due to the self-signed SSL certificate when running in development mode. To access the demo:

- Chrome: Click `Advanced` then `Proceed to local.virtru.com (unsafe)`
- Firefox: Click `Advanced` then `Accept the Risk and Continue`
- Safari: Click `Show Details` then `visit this website`
- Opera: Click `Help me understand` then `Proceed to local.virtru.com (unsafe)`

## Getting Help

There are many ways to get our attention:

- You can [join](https://docs.google.com/forms/d/e/1FAIpQLSfCx5tSl9hGQSZ-H-ZIzNw6uWIPN3_HSpMtYssKQ9jytj9yQQ/viewform) Virtru's Developer Hub Community Slack channel to get your questions answered.
- You can open a support ticket [here](https://support.virtru.com/hc/en-us/requests/new?ticket_form_id=360001419954).

### License

Copyright © 2019 Virtru Corporation

This repo is released under the MIT license for all artifacts in this repo.
