import { AddItem } from '@/components/AddItem';
import { ABTest, updateCampaignByIndex } from '@/store/giftSlice';
import {
  CampaignInfo,
  GiftCampaignType,
  RuleList,
  TriggerType,
} from '@/types/gift';
import { CloseOutlined } from '@ant-design/icons';
import { Input, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LevelPicker } from '../../LevelPicker';

export function TriggerList({ groupIndex, ruleGroupIndex }): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [triggers, setTriggers] = useState<RuleList[]>([]);
  const { currentCampaignInfos, abTestModel, currentCampaignType, isEdit } =
    useSelector((store) => store.gift);
  const options = Object.values(TriggerType).map((value) => ({
    value,
    label: t(value),
  }));

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign) return;
    const group = campaign?.groups[groupIndex];
    if (!group) return;
    const ruleGroups = group.ruleGroups[ruleGroupIndex]?.ruleList;
    setTriggers(ruleGroups);
  }, [currentCampaignInfos]);

  const getDefaultLevel = (index: number) => {
    const trigger = triggers[index];
    const start = trigger.parameters.level;
    const end = trigger.parameters.maxLevel;
    if (!start || !end) return;
    return [Number(start), Number(end)];
  };

  const getMaxLevel = (trigger) => {
    const maxLevel = trigger.parameters?.maxLevel;
    if (maxLevel === String(Number.MAX_SAFE_INTEGER)) return '';
    return maxLevel;
  };

  const getDisable = () => {
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign?.campaign) return;
    if (
      campaign.campaign.type === GiftCampaignType.MILESTONE ||
      campaign.campaign.type === GiftCampaignType.LEVEL_UP
    ) {
      return isEdit;
    }
    return false;
  };

  const getShowDelay = (trigger) => {
    if (trigger.conditionName === TriggerType.MILESTONE) return false;
    if (
      trigger.conditionName === TriggerType.IDLE &&
      currentCampaignType !== GiftCampaignType.ALL
    )
      return false;

    return true;
  };

  const getShowIdel = (trigger) => {
    if (trigger.conditionName !== TriggerType.IDLE) return false;
    if (currentCampaignType === GiftCampaignType.ALL) return true;
    return false;
  };

  const onAddEmptyTrigger = (triggerIndex: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[groupIndex];
    const rule: RuleList = {
      ruleOperation: 'AND',
      conditionName: TriggerType.GAME_LOADED,
      parameters: { sec: '0' },
    };
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    copyTriggers.splice(triggerIndex + 1, 0, rule);
    group.ruleGroups[ruleGroupIndex].ruleList = copyTriggers;
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onDeleteTriggerByIndex = (index: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[groupIndex];
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    copyTriggers.splice(index, 1);
    group.ruleGroups[ruleGroupIndex].ruleList = copyTriggers;
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onChangeTriggerType = (type: string, index: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[groupIndex];
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    const trigger: RuleList = copyTriggers[index];
    do {
      if (type === TriggerType.LEVEL_UP) {
        trigger.parameters.step = '1';
        trigger.parameters.sec = '15';
        trigger.parameters.operator = 'step';
        break;
      }
      if (type === TriggerType.IDLE) {
        trigger.parameters.delaySec = '90';
        trigger.parameters.sec = '2';
        break;
      }

      trigger.parameters.sec = '5';
    } while (false);

    trigger.conditionName = type;
    group.ruleGroups[ruleGroupIndex].ruleList = copyTriggers;
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onChangeParameter = (
    index: number,
    ruleOperation: string,
    params: {
      sec?: string;
      expression?: string;
      level?: string;
      maxLevel?: string;
      delaySec?: string;
      step?: string;
      operator?: string;
    },
  ) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[groupIndex];
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    const trigger: RuleList = copyTriggers[index];
    Object.keys(params).forEach(
      (key) => (trigger.parameters[key] = params[key]),
    );
    if (ruleOperation) trigger.ruleOperation = ruleOperation;
    group.ruleGroups[ruleGroupIndex].ruleList = copyTriggers;

    if (abTestModel === ABTest.GIFT) {
      const targetGroup = JSON.parse(JSON.stringify(group));
      campaign.groups.fill(targetGroup);
    }

    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  return (
    <>
      {triggers.map((trigger, index) => {
        return (
          <div
            key={`trigger_item_${index}`}
            className="border-l pl-4 border-@MainGreen flex gap-2  flex-col "
          >
            {index !== 0 && (
              <Switch
                checked={
                  trigger.ruleOperation ? trigger.ruleOperation === 'AND' : true
                }
                checkedChildren="AND"
                className="w-14 mb-5 bg-@MainGreen"
                defaultChecked
                disabled={getDisable()}
                unCheckedChildren="OR"
                onChange={(checked) =>
                  onChangeParameter(index, checked ? 'AND' : 'OR', {})
                }
              />
            )}

            <div className="flex gap-4 items-center ">
              <span className="text-@textheading w-20">
                {t('gift.trigger')} {index + 1}
              </span>
              <Select
                className="w-40"
                defaultValue={trigger.conditionName}
                disabled={getDisable()}
                options={options}
                value={trigger.conditionName}
                onChange={(vlaue) => onChangeTriggerType(vlaue, index)}
              />
            </div>
            {trigger.conditionName === TriggerType.MILESTONE && (
              <div className="flex gap-4 items-center">
                <span className="text-@textlable w-20">
                  {t('gift.keyword')}
                </span>
                <Input
                  className="w-80"
                  disabled={getDisable()}
                  placeholder="Example: 5-1"
                  value={trigger.parameters.expression}
                  onChange={(e) =>
                    onChangeParameter(index, '', {
                      expression: e.target.value,
                    })
                  }
                />
              </div>
            )}
            {trigger.conditionName === TriggerType.LEVEL_UP &&
              currentCampaignType !== GiftCampaignType.ALL && (
                <div className="flex gap-4 items-center">
                  <span className="text-@textlable w-20">
                    {t('gift.level_range')}
                  </span>
                  <LevelPicker
                    callback={(levels) => {
                      onChangeParameter(index, '', {
                        level: levels[0],
                        maxLevel: levels[1],
                      });
                    }}
                    defaultLevel={getDefaultLevel(index)}
                  />
                </div>
              )}

            {trigger.conditionName === TriggerType.LEVEL_UP &&
              currentCampaignType === GiftCampaignType.ALL && (
                <div className="flex gap-4  flex-col">
                  <div className="flex items-center gap-4">
                    <span className="w-20 ">{t('gift.level_range')}</span>
                    <div className="flex gap-2 items-center">
                      <Input
                        className="w-24"
                        disabled={getDisable()}
                        type="number"
                        value={trigger.parameters?.level}
                        onChange={(e) =>
                          onChangeParameter(index, '', {
                            level: e.target.value,
                          })
                        }
                      />
                      <span>～</span>
                      <Input
                        className="w-24"
                        disabled={getDisable()}
                        type="number"
                        value={getMaxLevel(trigger)}
                        onChange={(e) =>
                          onChangeParameter(index, '', {
                            maxLevel: e.target.value,
                          })
                        }
                      />
                      <span>{t('gift.blast_desc')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-20" />
                    <span className="">{t('gift.time_interval')}</span>
                    <Input
                      className="w-24"
                      disabled={getDisable()}
                      value={trigger.parameters?.step}
                      onChange={(e) =>
                        onChangeParameter(index, '', {
                          step: e.target.value,
                          operator: e.target.value ? 'step' : '>=',
                        })
                      }
                    />
                    <span>{t('gift.level_trigger')}</span>
                  </div>
                </div>
              )}

            {getShowIdel(trigger) && (
              <div className="flex gap-4 items-center">
                <span className="w-20">{t('gift.idle')}</span>
                <Input
                  className="w-24"
                  disabled={getDisable()}
                  value={trigger.parameters.delaySec}
                  onChange={(e) =>
                    onChangeParameter(index, '', { delaySec: e.target.value })
                  }
                />
                <span className="text-@textlable"> {t('gift.idle_after')}</span>
              </div>
            )}

            {getShowDelay(trigger) && (
              <div className="flex gap-4 items-center">
                <span className="w-20">{t('gift.delay')}</span>
                <Input
                  className="w-24"
                  disabled={getDisable()}
                  value={trigger.parameters.sec}
                  onChange={(e) =>
                    onChangeParameter(index, '', { sec: e.target.value })
                  }
                />
                <span className="text-@textlable"> {t('gift.sec_after')}</span>
              </div>
            )}

            {/* 添加触发条件 */}
            <div className="flex justify-end gap-4">
              {index === triggers.length - 1 && (
                <>
                  <AddItem
                    click={() => onAddEmptyTrigger(index)}
                    title={t('gift.add_trigger')}
                  />
                </>
              )}
              {triggers.length > 1 && (
                <CloseOutlined onClick={() => onDeleteTriggerByIndex(index)} />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
