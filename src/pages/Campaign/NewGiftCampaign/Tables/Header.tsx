import {
  deleteBatchCampaignByIds,
  updateBatchCampaignStatus,
} from '@/api/gift/commonGampaign';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function Header({
  ids,
  callback,
  showDelete = false,
}: {
  ids: number[];
  callback: () => void;
  showDelete?: boolean;
}): JSX.Element {
  const { t } = useTranslation();

  const update = async (isChecked: boolean) => {
    await updateBatchCampaignStatus(ids, isChecked, () => callback());
  };

  const onDelete = async () => {
    await deleteBatchCampaignByIds(ids, () => callback());
  };
  return (
    <div className="flex gap-2">
      <Button onClick={() => update(true)}>Turn on</Button>
      <Button onClick={() => update(false)}>Turn off</Button>
      {showDelete && <Button onClick={() => onDelete()}>Delete</Button>}
    </div>
  );
}
