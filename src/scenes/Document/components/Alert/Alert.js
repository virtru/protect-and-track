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

import React, { useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import './Alert.css';

function Alert({ alert, clearAlert }) {
  useEffect(() => {
    if (!alert) {
      return;
    }
    const timer = setTimeout(() => {
      clearAlert(alert);
    }, 8000);
    return () => clearTimeout(timer);
  }, [alert, clearAlert]);

  if (!alert) {
    return null;
  }

  return (
    <div className="Alert">
      <img alt="" src="danger-small.svg" onClick={() => clearAlert(alert)} />
      {alert}
    </div>
  );
}

const mapToProps = ({ alert }) => ({ alert });
const actions = {
  // TODO clean up alerts smarter
  // E.g make alerts {message, timestamp} or have a sequence id
  clearAlert: ({ alert: currentAlert }, oldAlert) =>
    currentAlert === oldAlert ? { alert: false } : {},
};
export default connect(
  mapToProps,
  actions,
)(Alert);
