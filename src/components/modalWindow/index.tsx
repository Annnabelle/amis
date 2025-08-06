import React, { type ReactNode } from 'react';
import { Modal } from 'antd';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import './styles.sass';

export interface ModalProps {
    closeModal?: ()=> void,
    openModal?: boolean,
    children?: ReactNode,
    title?: string,
    handleAction?: () => void
    handleDelete?: () => void,
    handleEdit?: () => void
    handleCancel?: () => void
    className?: string
}

const ModalWindow: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <Modal
      centered
      title={
        <div className='modal-heading-container'>
          <div className="modal-heading-title">
            <h3 className="title">{props?.title}</h3>
            <div className="modal-heading-title-icon">
              {props?.handleDelete && (
                <div className="modal-heading-title-icon-trash">
                  <FaRegTrashAlt onClick={props?.handleDelete} className='svg-trash' />
                </div>
              )}
              {props?.handleEdit && (
                <div className="modal-heading-title-icon-edit">
                  <BiEditAlt onClick={props?.handleEdit} className='svg-edit' />
                </div>
              )}
            </div>
          </div>
        </div>
      }
      className={`modal-window ${props?.className}`}
      open={props?.openModal}
      onCancel={props?.closeModal}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default ModalWindow;