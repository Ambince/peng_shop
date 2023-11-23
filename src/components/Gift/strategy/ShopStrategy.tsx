import React from 'react';
import { useTranslation } from 'react-i18next';

import { Bill } from '../icons/Bill';
import { GiftGampaignItem } from '../trigger/container/GiftGampaignItem';

export function ShopStrategy(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="bg-@lightbggrey w-full rounded px-4 flex flex-col gap-3 pb-4 rounded-b-lg">
      {/* 触发条件 title */}
      <div className="flex gap-2 items-center py-4">
        <Bill className="flex text-@MainGreen" />
        <span className="font-bold">{t('trigger_rules')}</span>
      </div>

      {/* Group list,Only one Campaign */}
      <div className=" flex flex-col gap-3">
        <GiftGampaignItem index={0} />
      </div>
    </div>
  );
}
