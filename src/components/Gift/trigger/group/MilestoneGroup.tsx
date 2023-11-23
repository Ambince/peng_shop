import { updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, TriggerType } from '@/types/gift';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CreateGfit } from '../common/CreateGift';

export function MilestoneGroup({ index }: { index: number }): JSX.Element {
  const { currentCampaignInfos } = useSelector((store) => store.gift);
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | undefined>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onChangeParamters = (params: { sec?: string; expression?: string }) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[index]),
    );
    if (!campaign) return;
    for (const group of campaign.groups) {
      const preParameters = group.ruleGroups[0]?.ruleList[0]?.parameters ?? {};
      group.ruleGroups = [
        {
          ruleList: [
            {
              conditionName: TriggerType.MILESTONE,
              parameters: { ...preParameters, ...params },
            },
          ],
        },
      ];
    }
    dispatch(updateCampaignByIndex({ index, campaign }));
  };

  useEffect(() => {
    if (!currentCampaignInfos) return;
    setCampaignInfo(currentCampaignInfos[index]);
  }, [currentCampaignInfos]);

  return (
    <div className="flex flex-col  gap-3  py-4 overflow-scroll no-scrollbar">
      <CreateGfit campaignIndex={index} className="h-36 overflow-x-scroll" />

      <span className="font-bold text-sm mt-6">{t('gift.complete_event')}</span>

      <div className="border-l pl-4 border-@MainGreen flex gap-2  flex-col">
        <div className="flex gap-4 items-center">
          <span className="w-20">{t('gift.trigger')}</span>
          <span className="text-@textlable">{t('gift.keyword')}</span>
          <Input
            className="w-80"
            placeholder="Example: 5-1"
            value={
              campaignInfo?.groups[0]?.ruleGroups[0]?.ruleList[0]?.parameters
                ?.expression
            }
            onChange={(e) => onChangeParamters({ expression: e.target.value })}
          />
        </div>

        {/* <div className="flex gap-4 items-center">
          <span className="w-20">{t('gift.delay')}</span>
          <Input
            className="w-24"
            type="number"
            value={
              campaignInfo?.groups[0]?.ruleGroups[0]?.ruleList[0]?.parameters
                ?.sec
            }
            onChange={(e) => onChangeParamters({ sec: e.target.value })}
          />
          <span className="text-@textlable"> {t('sec')}</span>
        </div> */}
      </div>
    </div>
  );
}
