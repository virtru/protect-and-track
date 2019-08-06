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

import React, { useLayoutEffect, useRef } from 'react';
import './StayUp.css';
import Modal from '../../components/Modal/Modal';

function StayUp({ onClose, userId }) {
  const scriptWrapper = useRef();

  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
    window.hbspt.forms.create({
      portalId: "1769758",
      formId: "a033c54f-7ee6-4e4d-9324-1f52454f17dc",
      onFormReady: function($form, ctx){
        $form.find('input[name="email"]').val('${userId}').change();
      }
    });
  `;
    scriptWrapper.current.appendChild(script);
  }, [userId]);

  return (
    <Modal onClose={onClose}>
      <div className="StayUp-container" ref={scriptWrapper}>
        <h1>Stay Up to Date</h1>
        <p>
          Connect with us to get updates about the latest developer tools and resources from Virtru.
        </p>
      </div>
    </Modal>
  );
}

export default StayUp;
