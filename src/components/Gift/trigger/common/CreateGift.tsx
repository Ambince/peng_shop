import { getGiftPriceById } from '@/api/gift/levelup';
import { GiftListItem } from '@/pages/Campaign/NewGiftCampaign/GiftListItem';
import { ABTest, updateCampaignByIndex } from '@/store/giftSlice';
import {
  CampaignInfo,
  GiftCampaignType,
  GiftInfo,
  GiftWidgetMode,
} from '@/types/gift';
import { PlusCircleOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GiftContainer } from '../../GiftContainer';

export function CreateGfit({
  className,
  campaignIndex,
  once = false,
}: {
  campaignIndex: number;
  className?: string;
  once?: boolean;
}): JSX.Element {
  const {
    currentCampaignType,
    currentCampaignInfos,
    application,
    abTestModel,
  } = useSelector((store) => store.gift);
  const dispatch = useDispatch();
  const [gifts, setGifts] = useState<GiftInfo[]>([]);
  const [isShowAddGift, setIsShowAddGift] = useState<boolean>(true);
  const [isOpenIFrame, setIsOpenIFrame] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | undefined>();
  const [currentCampaign, setCurrentCampaign] = useState<
    CampaignInfo | undefined
  >();
  const props = {
    appid: application.appId,
    language: 'en',
    status: 'PUBLISHED',
    supports_ai: true,
    mode: GiftWidgetMode.PAID_GIFT,
  };

  const onSelectGiftSuccess = async (internalGiftInfo) => {
    if (!internalGiftInfo) return;
    if (!currentCampaign) return;
    const campaign = JSON.parse(JSON.stringify(currentCampaign));
    const groups = campaign.groups;
    if (!groups[0]) return;
    let currentGroup = JSON.parse(JSON.stringify(groups[0]));
    if (replaceIndex) currentGroup = groups[replaceIndex];
    if (!currentGroup) return;
    let preGiftCount = gifts.length;
    let groupIndex = gifts.length;
    setGifts((pre) => {
      if (replaceIndex !== undefined) {
        pre.splice(replaceIndex, 1, internalGiftInfo);
        return [...pre];
      }
      return [...pre, internalGiftInfo];
    });
    if (replaceIndex === undefined) preGiftCount++;
    if (replaceIndex !== undefined) groupIndex = replaceIndex;
    currentGroup.giftId = internalGiftInfo.displayId;
    currentGroup.giftInfo = internalGiftInfo;

    try {
      const res = await getGiftPriceById(
        currentGroup.giftId,
        application.appId,
      );
      currentGroup.giftInfo.localPrice = res.localPrice;
    } catch (error) {
      console.info(`[create gift]`, error);
    }
    delete currentGroup.id;
    groups[groupIndex] = currentGroup;
    if (
      abTestModel === ABTest.GIFT ||
      !abTestModel ||
      currentCampaignType !== GiftCampaignType.NORMAL
    ) {
      const ratio = Number(1 / preGiftCount);
      for (const group of groups) group.ratio = ratio;
    }

    if (abTestModel === ABTest.TRIGGER) {
      for (const group of groups) {
        group.giftId = currentGroup.giftId;
        group.giftInfo = currentGroup.giftInfo;
      }
    }

    if (preGiftCount > 0 && once) setIsShowAddGift(false);
    dispatch(updateCampaignByIndex({ index: campaignIndex, campaign }));
    setIsOpenIFrame(!isOpenIFrame);
    setReplaceIndex(undefined);
  };

  const onDeleteGiftByIndex = (index) => {
    setGifts((pre) => {
      pre.splice(index, 1);
      return [...pre];
    });
    const campaign = JSON.parse(JSON.stringify(currentCampaign));
    const groups: any[] = campaign.groups;
    if (
      (currentCampaignType === GiftCampaignType.NORMAL && once) ||
      groups.length === 1
    ) {
      for (const group of groups) {
        delete group.ratio;
        delete group.giftId;
        delete group.giftInfo;
      }
      setIsShowAddGift(true);
    } else {
      groups.splice(index, 1);
      if (abTestModel === ABTest.GIFT) {
        const ratio = Number(1 / groups.length);
        for (const group of groups) {
          group.ratio = ratio;
        }
      }
    }
    dispatch(updateCampaignByIndex({ index: campaignIndex, campaign }));
  };

  const onReplaceGiftByIndex = (index) => {
    setReplaceIndex(index);
    setIsOpenIFrame(true);
  };

  const onReCalculateRatio = (ratio, index) => {
    try {
      if (Number(ratio) > 100) return;
    } catch (error) {
      return;
    }
    if (abTestModel !== ABTest.GIFT) return;
    const campaign = JSON.parse(JSON.stringify(currentCampaign));
    const groups: any[] = campaign.groups;
    const left = 100 - Number(ratio);
    if (groups.length > 1) {
      const currentRatio = Number(left / (groups.length - 1)).toFixed(2);
      for (const group of groups) {
        group.ratio = currentRatio;
      }
    }
    groups[index].ratio = ratio;
    dispatch(updateCampaignByIndex({ index: campaignIndex, campaign }));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e) return;
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = 50;
      if (e.deltaY > 0) {
        container.scrollLeft += scrollAmount;
      } else {
        container.scrollLeft -= scrollAmount;
      }
      containerRef.current?.addEventListener(
        'touchstart',
        (event) => {
          event.preventDefault();
        },
        { passive: false },
      );
    }
  };

  const showMultiGiftItem = (index) => {
    if (index > 0 && once) return false;
    return true;
  };

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campainInfo: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[campaignIndex]),
    );
    const preGifts: GiftInfo[] = [];
    for (const group of campainInfo.groups) {
      if (group.giftInfo) preGifts.push(group.giftInfo);
    }
    if (preGifts.length > 0 && once) setIsShowAddGift(false);
    if (preGifts.length === 0) setIsShowAddGift(true);
    setGifts(preGifts);
    setCurrentCampaign(campainInfo);
  }, [currentCampaignInfos, once]);

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-scroll overflow-y-hidden  gap-3 items-center py-2 ${className} no-scrollbar`}
      onWheel={handleWheel}
    >
      {isOpenIFrame && (
        <GiftContainer
          dissmiss={() => setIsOpenIFrame(!isOpenIFrame)}
          props={props}
          success={(giftInfo) => onSelectGiftSuccess(giftInfo)}
        />
      )}

      {isShowAddGift && (
        <div
          className="w-28 flex-shrink-0  border-dashed h-28  border flex items-center justify-center rounded-md hover:cursor-pointer hover:opacity-70"
          onClick={() => setIsOpenIFrame(true)}
        >
          <div className="flex gap-2 items-center">
            <PlusCircleOutlined className="text-@MainGreen" />
            {t('gift.gift')}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {gifts.map((gift, index) => {
          return (
            <div key={`gift_item_${gift.id}_${index}`}>
              {showMultiGiftItem(index) && (
                <GiftListItem
                  giftInfo={gift}
                  index={index + 1}
                  ratio={currentCampaign?.groups[index]?.ratio ?? 0}
                  reCalculateRatioCallback={(ratio) =>
                    onReCalculateRatio(ratio, index)
                  }
                  onDeleteCallback={() => onDeleteGiftByIndex(index)}
                  onReplaceGiftCallback={() => onReplaceGiftByIndex(index)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
