import { GiftTitile } from '@/components/Gift/GiftTitle';
import { Gift } from '@/components/Gift/icons/Gift';
import { Level } from '@/components/Gift/icons/Level';
import { Trace } from '@/components/Gift/icons/Trace';
import {
  getLevelInfo,
  setCurrentGiftType,
  setFlushPageType,
} from '@/store/giftSlice';
import { GIFT_LOCAL, GiftCampaignType } from '@/types/gift';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LevelupTable } from './Tables/LevelupTable';
import { MilestoneTable } from './Tables/MilestoneTable';
import { NormalTable } from './Tables/NormalTable';

export const iconMap = new Map<string, any>([
  [GiftCampaignType.NORMAL, <Gift />],
  [GiftCampaignType.LEVEL_UP, <Level />],
  [GiftCampaignType.MILESTONE, <Trace />],
]);

export function NewGiftCampaign(): JSX.Element {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(GiftCampaignType.NORMAL);
  const dispatch = useDispatch();
  const { appId, flushPageType } = useSelector((store) => store.gift);

  const tableLable = (key: string) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex"> {iconMap.get(key)}</div>
        {t(`common.${key}`)}
      </div>
    );
  };

  const [tables, __] = useState([
    {
      label: tableLable(GiftCampaignType.NORMAL),
      children: <NormalTable type={GiftCampaignType.NORMAL} />,
      key: GiftCampaignType.NORMAL,
    },
    {
      label: tableLable(GiftCampaignType.LEVEL_UP),
      children: <LevelupTable type={GiftCampaignType.LEVEL_UP} />,
      key: GiftCampaignType.LEVEL_UP,
    },
    {
      label: tableLable(GiftCampaignType.MILESTONE),
      children: <MilestoneTable type={GiftCampaignType.MILESTONE} />,
      key: GiftCampaignType.MILESTONE,
    },
  ]);

  useEffect(() => {
    const localTab: any = localStorage.getItem(GIFT_LOCAL.TAB);
    if (localTab) setActiveKey(localTab);
    dispatch(setCurrentGiftType({ type: '' }));
  }, []);

  useEffect(() => {
    // @ts-ignore
    dispatch(getLevelInfo(appId));
  }, [appId]);

  useEffect(() => {
    if (flushPageType) setActiveKey(flushPageType);
  }, [flushPageType]);

  const onChangeActiveKey = (type: GiftCampaignType) => {
    setActiveKey(type);
    localStorage.setItem(GIFT_LOCAL.TAB, type);
    dispatch(setFlushPageType({ type }));
  };

  return (
    <div className="bg-@main-background w-full  flex-col gap-8 flex">
      <GiftTitile />

      <div className="bg-white ml-6 px-4 rounded-md ">
        <div className="py-4">
          <span className="text-@textheading text-lg font-bold">
            {t('gift.campaign_list')}
          </span>
        </div>
        <Tabs
          activeKey={activeKey}
          hideAdd
          items={tables}
          onChange={(key) => onChangeActiveKey(key as GiftCampaignType)}
        />
      </div>
    </div>
  );
}
