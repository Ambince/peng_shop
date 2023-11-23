import { useModal } from '@/pages/modal/ModalProvider';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function NoticeModal({
  success,
  title,
  content,
  okDesc,
  isDanger = false,
}): JSX.Element {
  const { hideModal } = useModal();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base text-@textheading">{title}</span>
      <span className="text-sm text-@textheading">{content}</span>
      <div className="flex gap-4 justify-end">
        <Button
          className="border-@MainGreen text-@MainGreen"
          onClick={() => hideModal()}
        >
          {t('common_cancel')}
        </Button>
        <Button danger={isDanger} type="primary" onClick={success}>
          {okDesc}
        </Button>
      </div>
    </div>
  );
}
