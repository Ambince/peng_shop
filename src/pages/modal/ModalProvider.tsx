// ModalProvider.tsx
import { Modal } from 'antd';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalContextType = {
  showModal: (content: ReactNode, width?: string) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [width, setWidth] = useState(false);

  const showModal = (content: ReactNode, curWidth) => {
    setWidth(curWidth);
    setModalContent(content);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        centered
        className={`${width}`}
        footer={null}
        open={isVisible}
        zIndex={1000}
        onCancel={hideModal}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
