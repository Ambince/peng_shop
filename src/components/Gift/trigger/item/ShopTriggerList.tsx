import { AddItem } from '@/components/AddItem';
import { updateCampaignByIndex } from '@/store/giftSlice';
import {
  CampaignInfo,
  RuleList,
  ShopTriggerType,
  TriggerType,
} from '@/types/gift';
import { CloseOutlined } from '@ant-design/icons';
import { Input, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export function ShopTriggerList({ groupIndex, ruleGroupIndex }): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [triggers, setTriggers] = useState<RuleList[]>([]);
  const { currentCampaignInfos } = useSelector((store) => store.gift);
  const [options, setOptions] = useState<any[]>([]);
  const [preOptions, setPreOptions] = useState<any>({
    0: ShopTriggerType.GAME_LOADED,
  });

  const initData = () => {
    const values: any[] = [];
    Object.keys(preOptions).reduce((selectArray, item) => {
      selectArray.push(preOptions[item]);
      return selectArray;
    }, values);

    const curOptions = Object.values(ShopTriggerType).map((value) => ({
      value,
      label: t(value),
      disabled: values.includes(value),
    }));
    setOptions(curOptions);
  };

  useEffect(() => {
    initData();
  }, [preOptions]);

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign) return;
    const group = campaign?.groups[groupIndex];
    if (!group) return;
    const ruleGroups = group.ruleGroups[ruleGroupIndex]?.ruleList;
    setTriggers(ruleGroups);
  }, [currentCampaignInfos]);

  const getDisable = () => {
    return false;
  };

  const onAddEmptyTrigger = (triggerIndex: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const values: any[] = [];
    Object.keys(preOptions).reduce((selectArray, item) => {
      selectArray.push(preOptions[item]);
      return selectArray;
    }, values);

    const type = Object.values(ShopTriggerType).filter(
      (key) => !values.includes(key),
    );
    const selectedOptions = JSON.parse(JSON.stringify(preOptions));
    selectedOptions[triggerIndex + 1] = type[0];
    setPreOptions(selectedOptions);
    const group = campaign.groups[groupIndex];
    const parameters = { sec: '5' } as any;
    if (type[0] === ShopTriggerType.LEVEL_UP) parameters.level = '1';
    const rule: RuleList = {
      ruleOperation: 'AND',
      conditionName: type[0] as any,
      parameters,
    };
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    copyTriggers.splice(triggerIndex + 1, 0, rule);
    group.ruleGroups[ruleGroupIndex].ruleList = copyTriggers;
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onDeleteTriggerByIndex = (index: number) => {
    delete preOptions[index];
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
    const selectedOptions = JSON.parse(JSON.stringify(preOptions));
    selectedOptions[index] = type;
    setPreOptions(selectedOptions);
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[groupIndex];
    const copyTriggers = JSON.parse(JSON.stringify(triggers));
    const trigger: RuleList = copyTriggers[index];

    if (type !== TriggerType.LEVEL_UP) {
      trigger.parameters = {};
      if (type === TriggerType.MILESTONE) trigger.parameters.sec = '5';
    } else {
      trigger.parameters.level = '1';
      trigger.parameters.sec = '15';
      trigger.parameters.operator = '>=';
    }
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
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const getShowAddTag = (index) => {
    return index === triggers.length - 1 && index < options.length - 1;
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
            {trigger.conditionName === TriggerType.LEVEL_UP && (
              <div className="flex gap-4 items-center">
                <span className="text-@textlable w-20">{'>='}</span>
                <Input
                  className="w-24"
                  disabled={getDisable()}
                  value={trigger.parameters.level}
                  onChange={(e) =>
                    onChangeParameter(index, '', { level: e.target.value })
                  }
                />
              </div>
            )}

            {trigger.conditionName !== TriggerType.MILESTONE && (
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
              {getShowAddTag(index) && (
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
