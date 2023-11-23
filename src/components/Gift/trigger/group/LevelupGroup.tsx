import { setLocalChoiceLevel, updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, TriggerType } from '@/types/gift';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LevelPicker } from '../../LevelPicker';
import { CreateGfit } from '../common/CreateGift';

export function LevelupGroup({ index }: { index: number }): JSX.Element {
  const { currentCampaignInfos, isEdit } = useSelector((store) => store.gift);
  const dispatch = useDispatch();
  const [currentLevels, setCurrentLevels] = useState<number[] | undefined>();

  const onChangeLevels = (levels: any) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[index]),
    );
    if (!campaign) return;
    campaign.campaign.name = `Level ${levels[0]} - Level ${levels[1]}`;
    dispatch(setLocalChoiceLevel({ levels }));
    for (const group of campaign.groups) {
      group.ruleGroups = [
        {
          ruleList: [
            {
              conditionName: TriggerType.LEVEL_UP,
              parameters: {
                level: levels[0],
                maxLevel: levels[1],
                step: '1',
                sec: '15',
                operator: 'step',
              },
            },
          ],
        },
      ];
    }
    dispatch(updateCampaignByIndex({ index, campaign }));
  };

  useEffect(() => {
    const campaignInfo: CampaignInfo = currentCampaignInfos[index];
    const ruleGroup = campaignInfo?.groups[0]?.ruleGroups[0];
    if (!ruleGroup) return;
    const rule = campaignInfo.groups[0].ruleGroups[0].ruleList[0];
    const level = Number(rule.parameters.level);
    const maxLevel = Number(rule.parameters.maxLevel);
    setCurrentLevels([level, maxLevel]);
  }, [currentCampaignInfos]);

  return (
    <div className="flex  h-36 gap-3 items-center py-4 ">
      <div className="flex flex-col items-center gap-2 justify-center border-r pr-6 mr-2 h-full">
        <LevelPicker
          callback={(levels) => onChangeLevels(levels)}
          defaultLevel={currentLevels}
        />
      </div>

      <CreateGfit campaignIndex={index} className="h-36 flex-1" />
    </div>
  );
}
