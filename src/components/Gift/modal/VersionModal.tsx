import { createVersion } from '@/api/super/version_admin';
import { useModal } from '@/pages/modal/ModalProvider';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconTile } from '../IconTitle';

export function VersionModal({ success }): JSX.Element {
  const { hideModal } = useModal();
  const { t } = useTranslation();
  const [appVersion, setAppVersion] = useState('');

  const onCrateVersion = async () => {
    const res = await createVersion({ appVersion });
    success();
    hideModal();
  };

  return (
    <div className="flex flex-col gap-2 h-40 relative justify-center">
      <span className="text-base text-@textheading absolute top-0">
        Create New Version
      </span>

      <div className="flex gap-4 ">
        <IconTile icon="game" title="Version" />
        <Input
          className="w-[280px]"
          onChange={(e) => setAppVersion(e.target.value)}
        />
      </div>

      <div className="flex gap-4 justify-end absolute bottom-0 w-full">
        <Button
          className="border-@MainGreen text-@MainGreen"
          onClick={() => hideModal()}
        >
          {t('common_cancel')}
        </Button>
        <Button type="primary" onClick={() => onCrateVersion()}>
          {t('confirm')}
        </Button>
      </div>
    </div>
  );
}
