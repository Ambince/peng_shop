import { SelectProps } from '@/api/gift/commonGampaign';
import { AddItem } from '@/components/AddItem';
import { SuperContents } from '@/pages/Campaign/SuperAdmin/contents';
import { useModal } from '@/pages/modal/ModalProvider';
import { updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, RuleGroup, TriggerType } from '@/types/gift';
import { DeleteFilled } from '@ant-design/icons';
import { Input, Switch, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TriggerList } from '../item/TriggerList';

const { Search } = Input;
export function AllGroup({ index }: { index: number }): JSX.Element {
  const dispatch = useDispatch();
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
  const { currentCampaignInfos } = useSelector((store) => store.gift);
  const [contents, setContents] = useState<SelectProps[]>([]);
  const { showModal, hideModal } = useModal();
  const { t } = useTranslation();

  const onAddEmptyRuleGroup = (ruleIndex: number) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    const ruleGroup = {
      ruleGroupOperation: 'AND',
      ruleList: [
        { conditionName: TriggerType.MILESTONE, parameters: { sec: '0' } },
      ],
    };
    group.ruleGroups.splice(ruleIndex + 1, 0, ruleGroup);
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
  };

  const onChangeParameter = (params: { [key: string]: string }) => {
    const campaign: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    const group = campaign.groups[index];
    Object.keys(params).forEach((key) => {
      group[key] = params[key];
    });
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
    onChangeParameter({ ratio });
  };

  const onAddConentCallback = (record: any) => {
    console.info(`[record]`, record);
    onChangeParameter({ contentId: record.id });
    hideModal();
  };

  const onSelectContent = () => {
    showModal(
      <SuperContents
        callback={(record) => onAddConentCallback(record)}
        isModal
      />,
      'w-5/6',
    );
  };

  const initData = async () => {
    // const { info } = await fetchContens({
    //   pageIndex: 0,
    //   itemsPerPage: 10000,
    // });
    // const options = info.map((v) => ({ label: v.name, value: v.id }));
    // setContents(options);
  };

  useEffect(() => {
    if (contents.length === 0) initData();
    if (!currentCampaignInfos) return;
    const campaign: CampaignInfo = currentCampaignInfos[0];
    if (!campaign) return;
    const group = campaign.groups[index];
    if (!group) return;
    setRuleGroups(group.ruleGroups);
  }, [currentCampaignInfos]);

  return (
    <>
      {ruleGroups.map((ruleGroup, ruleIndex) => {
        return (
          <div
            key={`goup_${ruleIndex}`}
            className={`flex flex-col  gap-3  py-4 group hover:cursor-pointer  ${
              ruleGroups.length > 1 ? 'border-l-2 border-@blue/2' : ''
            } pl-4 `}
          >
            {ruleIndex !== 0 && (
              <Switch
                checked={
                  ruleGroup.ruleGroupOperation
                    ? ruleGroup.ruleGroupOperation === 'AND'
                    : true
                }
                checkedChildren="AND"
                className="w-14 mb-5 bg-@tag-text-3"
                defaultChecked
                unCheckedChildren="OR"
              />
            )}

            <div className="flex flex-col gap-3 border p-4 rounded-lg">
              {ruleIndex === 0 && (
                <div className="flex justify-between">
                  <div className="flex flex-col gap-3">
                    <span>{t('select_content_type')}</span>
                    <Search
                      className="w-64"
                      placeholder="search gfit"
                      value={currentCampaignInfos[0]?.groups[index]?.contentId}
                      onSearch={() => onSelectContent()}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <span>{t('user_ratio')}</span>
                    <Input
                      className="w-64 rounded-md"
                      value={currentCampaignInfos[0]?.groups[index]?.ratio}
                      onChange={(e) => onReCalculateRatio(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between  h-10 items-center">
                <span className="font-semibold text-sm ">
                  {t('gift.complete_event')}
                </span>
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
