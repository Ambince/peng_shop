import { AddItem } from '@/components/AddItem';
import { ABTest, ConfigModel, updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, Group, RuleGroup, TriggerType } from '@/types/gift';
import { DeleteFilled } from '@ant-design/icons';
import { Input, Switch, notification } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CreateGroupGfit } from '../common/CreateGroupGift';
import { TriggerList } from '../item/TriggerList';

export function NormalGroup({ index }: { index: number }): JSX.Element {
  const dispatch = useDispatch();
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
  const { currentCampaignInfos, abTestModel, configModel } = useSelector(
    (store) => store.gift,
  );
  const [isShowRatio, setIsShowRatio] = useState<boolean>(false);
  const [isShowGift, setIsShowGift] = useState<boolean>(false);

  const [isTriggerGroupOne, setIsTriggerGroupOne] = useState<boolean>(true);

  const onAddEmptyRuleGroup = (ruleIndex: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    const ruleGroup = {
      ruleGroupOperation: 'OR',
      ruleList: [
        { conditionName: TriggerType.MILESTONE, parameters: { sec: '0' } },
      ],
    };
    group.ruleGroups.splice(ruleIndex + 1, 0, ruleGroup);
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onDeleteRuleGroupByIndex = (ruleIndex: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    group.ruleGroups.splice(ruleIndex, 1);
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onReCalculateRatio = (ratio) => {
    try {
      if (Number(ratio) > 1) return;
    } catch (error) {
      return;
    }
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[index];
    group.ratio = ratio;
    const totalRatio = campaign.groups.reduce((total, item) => {
      return Number(total) + Number(item.ratio);
    }, 0);
    if (totalRatio > 1) {
      notification.error({
        message: 'Ratio Error',
        description: `input ${ratio},current ratio is ${totalRatio}`,
      });
      return;
    }
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onChangeParameter = (ruleIndex: number, operation) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group: Group = campaign.groups[index];
    const ruleGroup: RuleGroup = group.ruleGroups[ruleIndex];
    ruleGroup.ruleGroupOperation = operation;
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    setIsShowGift(false);
    if (configModel === ConfigModel.PRO) {
      setIsTriggerGroupOne(false);
      setRuleGroups(group.ruleGroups);
      setIsShowRatio(true);
      setIsShowGift(true);
      return;
    }
    if (abTestModel === ABTest.TRIGGER) {
      setRuleGroups(group.ruleGroups);
      setIsTriggerGroupOne(true);
      setIsShowRatio(true);
    } else {
      setRuleGroups([group.ruleGroups[0]]);
      setIsShowRatio(false);
      setIsTriggerGroupOne(true);
    }
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
            {ruleIndex !== 0 && (
              <Switch
                checked={ruleGroup.ruleGroupOperation === 'AND'}
                checkedChildren="AND"
                className="w-14 mb-5 bg-@tag-text-3"
                defaultChecked
                unCheckedChildren="OR"
                onChange={(checked) =>
                  onChangeParameter(ruleIndex, checked ? 'AND' : 'OR')
                }
              />
            )}
            <div className="flex flex-col gap-3 border p-4 rounded-lg ">
              {ruleIndex === 0 && (
                <div className="flex justify-between items-center ">
                  {isShowGift && (
                    <div className="flex-1 flex flex-col gap-3">
                      <span>{t('gift.choose_gift')}</span>
                      <CreateGroupGfit groupIndex={index} />
                    </div>
                  )}

                  {isShowRatio && (
                    <div className="flex-1 flex flex-col gap-3">
                      <span>{t('gift.ratio')}</span>
                      <Input
                        className="w-64 rounded-md"
                        type="number"
                        value={currentCampaignInfos[0]?.groups[index]?.ratio}
                        onChange={(e) => onReCalculateRatio(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between  h-10 items-center">
                <span className="font-semibold text-sm ">
                  {t('gift.complete_event')}
                </span>
                {!isTriggerGroupOne && (
                  <div className="flex gap-4 group-hover:visible invisible">
                    <AddItem
                      click={() => onAddEmptyRuleGroup(ruleIndex)}
                      title={t('gift.add_trigger_group')}
                    />
                    {ruleGroups.length > 1 && (
                      <DeleteFilled
                        onClick={() => onDeleteRuleGroupByIndex(ruleIndex)}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col ">
                <TriggerList groupIndex={index} ruleGroupIndex={ruleIndex} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
