import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { cn } from 'utils/bem-cn';

import './Modal.css';

ReactModal.setAppElement('#root');

function Modal(props) {
  const { children, ...modalProps } = props;
  return (
    <ReactModal
      {...modalProps}
      className={cn('modal', props)}
      overlayClassName="modal-overlay typography"
    >
      {children || 'Example Modal'}
    </ReactModal>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
