import { updateCampaignByIndex } from '@/store/giftSlice';
import { TriggerType } from '@/types/gift';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Bill } from '../icons/Bill';
import { GiftGampaignItem } from '../trigger/container/GiftGampaignItem';

export function AllStrategy(): JSX.Element {
  const { currentCampaignInfos } = useSelector((store) => store.gift);
  const [groups, setGroups] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const info = currentCampaignInfos[0];
    if (!info) return;
    setGroups(info.groups);
  }, [currentCampaignInfos]);

  const onCreateEmptyGroup = () => {
    const campaign = JSON.parse(JSON.stringify(currentCampaignInfos[0]));
    const ruleGroups = [
      {
        ruleList: [
          { conditionName: TriggerType.GAME_LOADED, parameters: { sec: '0' } },
        ],
      },
    ];
    const preTotal = campaign.groups.reduce(
      (total, group) => total + Number(group.ratio),
      0,
    );
    const group: any = {
      id: 0,
      contentId: 0,
      groupName: '',
      ratio: Math.max(1 - preTotal, 0),
      ruleGroups,
    };
    campaign.groups.push(group);
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  return (
    <div className="bg-@lightbggrey w-full rounded px-4 flex flex-col gap-3 pb-4 rounded-b-lg">
      {/* 触发条件 title */}
      <div className="flex gap-2 items-center py-4">
        <Bill className="flex text-@MainGreen" />
        <span className="text-bold ">{t('trigger_rules')}</span>
      </div>
      {/* Group list,Only one Campaign */}
      <div className=" flex flex-col gap-3">
        {groups.map((group, index) => {
          return <GiftGampaignItem key={`group_${index}`} index={index} />;
        })}
      </div>

      {/* add Cmapaign */}
      <div
        className="h-16 border  border-dashed w-full rounded flex items-center justify-center text-@textlable hover:cursor-pointer hover:opacity-70"
        onClick={() => onCreateEmptyGroup()}
      >
        + New Group
      </div>
    </div>
  );
}
