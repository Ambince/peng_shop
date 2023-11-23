import { CampaignInfo, RuleGroup } from '@/types/gift';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ShopTriggerList } from '../item/ShopTriggerList';

export function ShopGroup({ index }): JSX.Element {
  const dispatch = useDispatch();
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
  const { currentCampaignInfos, abTestModel, configModel } = useSelector(
    (store) => store.gift,
  );

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    setRuleGroups([group.ruleGroups[0]]);
  }, [currentCampaignInfos, abTestModel, configModel]);

  return (
    <>
      {ruleGroups.map((ruleGroup, ruleIndex) => {
        return (
          <div
            key={`goup_${ruleIndex}`}
            className={`flex flex-col  gap-3 bg-white py-4 group hover:cursor-pointer  ${
              ruleGroups.length > 1 ? 'border-l-2 border-@blue/2' : ''
            } pl-4 pr-4`}
          >
            <div className="flex flex-col gap-3 border p-4 rounded-lg ">
              <div className="flex justify-between  h-10 items-center">
                <span className="font-semibold text-sm ">
                  {t('gift.complete_event')}
                </span>
              </div>
              <div className="flex flex-col ">
                <ShopTriggerList
                  groupIndex={index}
                  ruleGroupIndex={ruleIndex}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
