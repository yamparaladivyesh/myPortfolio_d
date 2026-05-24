import React, { useState } from 'react';
import { FiPhone, FiMail, FiCopy } from 'react-icons/fi';
import { SiGmail } from 'react-icons/si';
import ModalWrapper from './ModalWrapper';

const contactItems = [
  {
    label: 'Phone',
    value: '+91 9697995566',
    action: 'tel:+919697995566',
    icon: <FiPhone />,
  },
  {
    label: 'Primary Email',
    value: 'divyeshyamp@gmail.com',
    action: 'mailto:divyeshyamp@gmail.com',
    icon: <FiMail />,
  },
  {
    label: 'Alternate Email',
    value: '2300031856cser@gmail.com',
    action: 'mailto:2300031856cser@gmail.com',
    icon: <SiGmail />,
  },
];

const ContactDropdown = ({ open, onClose }) => {
  const [copied, setCopied] = useState('');

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Contact Me" className="contact-modal">
      <div className="contact-grid">
        {contactItems.map((item) => (
          <div key={item.label} className="contact-card">
            <div className="contact-card-icon">{item.icon}</div>
            <div className="contact-card-copy">
              <span>{item.label}</span>
              <a href={item.action} onClick={onClose}>
                {item.value}
              </a>
            </div>
            <button type="button" className="clipboard-button" onClick={() => handleCopy(item.value)}>
              <FiCopy />
              <span>{copied === item.value ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default ContactDropdown;
