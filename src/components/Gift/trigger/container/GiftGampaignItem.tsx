import {
  clearLocalChoiceLevel,
  deleteCampainByIndex,
  updateCampaignByIndex,
} from '@/store/giftSlice';
import { CampaignInfo, GiftCampaignType } from '@/types/gift';
import { CaretDownFilled, DeleteFilled } from '@ant-design/icons';
import { Collapse } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { AllGroup } from '../group/AllGroup';
import { LevelupGroup } from '../group/LevelupGroup';
import { MilestoneGroup } from '../group/MilestoneGroup';
import { NormalGroup } from '../group/NormalGroup';
import { ShopGroup } from '../group/ShopGroup';

const { Panel } = Collapse;
const onlyOneCampaign = [GiftCampaignType.NORMAL, GiftCampaignType.ALL];

function CollapseTopRight({
  callback,
}: {
  callback?: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  const { currentCampaignInfos, currentCampaignType } = useSelector(
    (store) => store.gift,
  );

  const onDeleteClick = (e: any) => {
    e.stopPropagation();
    if (callback) callback();
  };

  const getCollapseCount = () => {
    if (onlyOneCampaign.includes(currentCampaignType)) {
      return currentCampaignInfos[0]?.groups?.length ?? 0;
    }
    return currentCampaignInfos.length;
  };

  return (
    <>
      {getCollapseCount() > 1 && (
        <div
          className="flex gap-2 items-center hover:opacity-70 hover:cursor-pointer hover:bg-@MainGreen group px-2 rounded  w-20 h-5"
          onClick={(e) => onDeleteClick(e)}
        >
          <DeleteFilled className="group-hover:text-white" size={16} />
          <span className="group-hover:text-white">{t('delete')}</span>
        </div>
      )}
    </>
  );
}

function CollapseTopLeft({
  isActive,
  title,
}: {
  isActive: boolean;
  title: string;
}): JSX.Element {
  return (
    <div className="flex gap-2 items-center hover:opacity-70 hover:cursor-pointer  group px-2 rounded h-5  ">
      <CaretDownFilled
        className={`group-hover:text-@MainGreen ${
          isActive ? '' : 'rotate-180'
        }`}
        size={16}
      />

      <span className="group-hover:text-@MainGreen text-xs font-bold text-@tag-text-3">
        {title}
      </span>
    </div>
  );
}

export function GiftGampaignItem({ index }: { index: number }): JSX.Element {
  const [activeKeys, setActiveKeys] = useState<string[] | string>(['1']);
  const [title, setTitle] = useState('');
  const {
    currentCampaignType,
    currentCampaignInfos,
    abTestModel,
    configModel,
  } = useSelector((store) => store.gift);
  const dispatch = useDispatch();
  const onChange = (key: string | string[]) => {
    setActiveKeys(key);
  };

  const groupMap = new Map<string, any>([
    [GiftCampaignType.ALL, <AllGroup index={index} />],
    [GiftCampaignType.NORMAL, <NormalGroup index={index} />],
    [GiftCampaignType.LEVEL_UP, <LevelupGroup index={index} />],
    [GiftCampaignType.MILESTONE, <MilestoneGroup index={index} />],
    [GiftCampaignType.SHOP, <ShopGroup index={index} />],
  ]);

  const onDeleteGroupOrCampaignByIndex = () => {
    if (onlyOneCampaign.includes(currentCampaignType)) {
      const campaign: CampaignInfo = JSON.parse(
        JSON.stringify(currentCampaignInfos[0]),
      );
      campaign.groups.splice(index, 1);
      dispatch(updateCampaignByIndex({ index: 0, campaign }));
      return;
    }

    const campaignInfo: CampaignInfo = currentCampaignInfos[index];
    const rule = campaignInfo?.groups[0]?.ruleGroups[0]?.ruleList[0];
    if (rule) {
      const start = rule?.parameters?.level;
      const end = rule?.parameters?.level;
      if (start && end) {
        dispatch(
          clearLocalChoiceLevel({ levels: [Number(start), Number(end)] }),
        );
      }
    }
    dispatch(deleteCampainByIndex({ index }));
  };

  useEffect(() => {
    const campaignInfo = currentCampaignInfos[index];
    if (!campaignInfo) return;
    const campaign: CampaignInfo = JSON.parse(JSON.stringify(campaignInfo));

    if (!campaign) return;
    const rule = campaign.groups[0]?.ruleGroups[0]?.ruleList[0];
    if (!rule) return;
    if (currentCampaignType === GiftCampaignType.LEVEL_UP) {
      const startLevel = rule.parameters.level;
      const endLevel = rule.parameters.maxLevel;
      setTitle(`Level ${startLevel} - Level ${endLevel}`);
    }
  }, [currentCampaignInfos]);

  const showNoCollapse = () => {
    if (currentCampaignType !== GiftCampaignType.NORMAL) return false;
    if (configModel === 0 && abTestModel !== 2) return true;
    return false;
  };

  return (
    <div className="bg-@lightbggrey w-full rounded">
      {showNoCollapse() ? (
        groupMap.get(currentCampaignType)
      ) : (
        <Collapse
          bordered={false}
          className="trigger-container"
          defaultActiveKey={activeKeys}
          ghost={false}
          onChange={onChange}
        >
          <Panel
            key="1"
            className="bg-white border-0"
            extra={
              <CollapseTopRight
                callback={() => onDeleteGroupOrCampaignByIndex()}
              />
            }
            header={
              <CollapseTopLeft
                isActive={activeKeys.includes('1')}
                title={title}
              />
            }
            showArrow={false}
          >
            {groupMap.get(currentCampaignType)}
          </Panel>
        </Collapse>
      )}
    </div>
  );
}
