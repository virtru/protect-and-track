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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'redux-zero/react';
import dispatchAuth from 'utils/dispatchAuth';

import 'index.css';
import App from './scenes/App/App';
import * as serviceWorker from 'serviceWorker';
import store from './store';

console.info(
  `AppInfo: ${process.env.REACT_APP_NAME}:${process.env.REACT_APP_VERSION}-${process.env
    .REACT_APP_BUILD_NUMBER || '0'}`,
);
if (dispatchAuth()) {
  // TODO consider rendering 'loading' or something. Also handle errors?
  // 'close' or 'app' <- close closes window, home reloads app
  // Maybe try to do the localstorage bits of the auth flows, too, in case we are here by mistake?
  // dispatchAuth just sends a message to the parent window, but if auth parts use clientside storage
  // we could do that part so the auth will work on a refresh (or click of the 'app' button above)
} else {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
