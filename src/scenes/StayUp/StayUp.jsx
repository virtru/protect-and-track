import React, { useLayoutEffect, useRef } from 'react';
import './StayUp.css';
import { Modal } from '../../components/Modal/Modal';

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
