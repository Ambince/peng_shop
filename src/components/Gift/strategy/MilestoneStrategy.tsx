import { setNewCampaignInfo } from '@/store/giftSlice';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Bill } from '../icons/Bill';
import { GiftGampaignItem } from '../trigger/container/GiftGampaignItem';

export function MilestoneStrategy(): JSX.Element {
  const { currentCampaignInfos } = useSelector((store) => store.gift);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const addEmptyCampaign = () => {
    dispatch(setNewCampaignInfo({}));
  };

  return (
    <div className="bg-@lightbggrey w-full rounded px-4 flex flex-col gap-3 pb-4">
      <div className="flex gap-2 items-center py-4">
        <Bill className="flex text-@MainGreen" />
        <span className="text-bold ">{t('gift.trigger')}</span>
      </div>
      <div className=" flex flex-col gap-3">
        {currentCampaignInfos.map((info, index) => {
          return (
            <GiftGampaignItem
              key={`${info.campaign.id}_${index}`}
              index={index}
            />
          );
        })}
      </div>

      <div
        className="h-16 border  border-dashed w-full rounded flex items-center justify-center text-@textlable hover:cursor-pointer hover:opacity-70"
        onClick={() => addEmptyCampaign()}
      >
        {t('gift.add_milestone')}
      </div>
    </div>
  );
}
