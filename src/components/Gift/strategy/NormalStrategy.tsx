import { ABTest, ConfigModel, updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, Group, TriggerType } from '@/types/gift';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Bill } from '../icons/Bill';
import { Gift } from '../icons/Gift';
import { CreateGfit } from '../trigger/common/CreateGift';
import { GiftGampaignItem } from '../trigger/container/GiftGampaignItem';

export function NormalStrategy(): JSX.Element {
  const { t } = useTranslation();

  const { currentCampaignInfos, abTestModel, configModel } = useSelector(
    (store) => store.gift,
  );
  const [groups, setGroups] = useState<Group[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const info: CampaignInfo = currentCampaignInfos[0];
    if (!info) return;
    if (abTestModel === ABTest.TRIGGER) {
      setGroups(info.groups);
    } else {
      setGroups([info.groups[0]]);
    }
    if (configModel === ConfigModel.PRO) {
      setGroups(info.groups);
    }
  }, [currentCampaignInfos]);

  const onCreateEmptyGroup = () => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    const rule = {
      conditionName: TriggerType.GAME_LOADED,
      parameters: { sec: '0' },
    };

    const ruleGroups = [{ ruleList: [rule] }];
    let giftId;
    let giftInfo;
    const firstGroup = campaign.groups[0];

    if (abTestModel === ABTest.TRIGGER && firstGroup) {
      giftId = firstGroup.giftId;
      giftInfo = firstGroup.giftInfo;
    }
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
      giftId,
      giftInfo,
    };
    campaign.groups.push(group);
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const showAddGroup = () => {
    return configModel !== ConfigModel.QUICK || abTestModel === ABTest.TRIGGER;
  };

  return (
    <div className="bg-@lightbggrey w-full rounded px-4 flex flex-col gap-3 pb-4 rounded-b-lg">
      {/* Choice Gift title */}
      {currentCampaignInfos.length > 0 && configModel === ConfigModel.QUICK && (
        <div className="flex h-full gap-3 justify-center py-2 flex-col w-full">
          <div className="flex gap-2 items-center py-4">
            <Gift className="flex text-@MainGreen" />
            <span className="font-bold">{t('gift.choose_gift')}</span>
          </div>
          <CreateGfit
            campaignIndex={0}
            once={abTestModel === ABTest.TRIGGER || !abTestModel}
          />
        </div>
      )}

      {/* 触发条件 title */}
      <div className="flex gap-2 items-center py-4">
        <Bill
          className={`flex ${
            configModel === ConfigModel.QUICK
              ? ' text-@MainGreen'
              : ' text-@tag-text-3'
          }`}
        />
        <span className="font-bold">{t('trigger_rules')}</span>
      </div>
      {/* Group list,Only one Campaign */}
      <div className=" flex flex-col gap-3">
        {groups.map((group, index) => {
          return <GiftGampaignItem key={`group_${index}`} index={index} />;
        })}
      </div>
      {/* add Cmapaign */}
      {showAddGroup() && (
        <div
          className="h-16 border  border-dashed w-full rounded flex items-center justify-center text-@textlable hover:cursor-pointer hover:opacity-70"
          onClick={() => onCreateEmptyGroup()}
        >
          {t('gift.create_ab')}
        </div>
      )}
    </div>
  );
}
