import { CampaignInfo, GiftInfo } from '@/types/gift';
import { Popover, Statistic } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GiftList } from './GiftList';

export function GiftItem({
  gift,
  isShow,
  campaignInfo,
  isDisabled,
}: {
  gift: GiftInfo | undefined;
  isShow: boolean;
  campaignInfo: CampaignInfo;
  isDisabled: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const parentRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  return (
    <Popover
      content={
        <GiftList
          campaignInfo={campaignInfo}
          dissmiss={() => setOpen(false)}
          parentRef={parentRef}
        />
      }
      open={open}
      trigger="click"
    >
      <div
        ref={parentRef}
        className="w-full flex justify-between p-1 text-black/25 hover:cursor-pointer hover:opacity-70 h-8"
        onClick={() => setOpen(true)}
      >
        {isShow && (
          <span
            className={`truncate ${
              isDisabled ? 'rgba(0, 0, 0, 0.65)' : 'text-@tag-text-2'
            }`}
            style={{ width: '100px' }}
          >
            {gift?.name}
          </span>
        )}

        {isShow && (
          <Statistic
            suffix="¥"
            value={gift?.localPrice}
            valueStyle={{
              fontSize: '12px',
              color: `${
                isDisabled ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.65)'
              }`,
            }}
          />
        )}
      </div>
    </Popover>
  );
}
