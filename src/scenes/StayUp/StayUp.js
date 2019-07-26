import React, { useLayoutEffect, useRef } from 'react';
import './StayUp.css';
import Modal from '../../components/Modal/Modal';

function StayUp({ onClose, userId }) {
  const script = document.createElement('script');
  script.innerHTML = `
    window.hbspt.forms.create({
      portalId: "1769758",
      formId: "a033c54f-7ee6-4e4d-9324-1f52454f17dc",
      onFormReady: function($form, ctx){
        $form.find('input[name="email"]').val('${userId}');
      }
    });
  `;
  const scriptWrapper = useRef();

  useLayoutEffect(() => {
    scriptWrapper.current.appendChild(script);
  }, [script]);

  return (
    <Modal onClose={onClose}>
      <div className="StayUp-container" ref={scriptWrapper}>
        <div className="StayUp-title">Stay Up to Date</div>
        <div className="StayUp-text">
          Connect with us to get updates about the latest developer tools and resources from Virtru.
        </div>
      </div>
    </Modal>
  );
}

export default StayUp;
