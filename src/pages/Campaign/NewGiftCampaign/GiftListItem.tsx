import { getGiftPriceById } from '@/api/gift/levelup';
import { ABTest, ConfigModel } from '@/store/giftSlice';
import { GiftCampaignType, GiftInfo } from '@/types/gift';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { Input, Statistic } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function GiftListItem({
  index,
  giftInfo,
  ratio,
  onDeleteCallback,
  onReplaceGiftCallback,
  reCalculateRatioCallback,
}: {
  ratio?: number;
  index: number;
  giftInfo: GiftInfo;
  onDeleteCallback: () => void;
  onReplaceGiftCallback: () => void;
  reCalculateRatioCallback?: (ratio) => void;
}): JSX.Element {
  const { t } = useTranslation();
  const [currentRatio, setCurrentRatio] = useState(0);
  const [isEditModel, setIsEditModel] = useState(false);
  const [currentGift, setCurrentGift] = useState<GiftInfo>(giftInfo);
  const { abTestModel, configModel, currentCampaignType, appId } = useSelector(
    (store) => store.gift,
  );
  const divRef = useRef<any>(null);

  const onChangeRatio = (inputRatio: string) => {
    setCurrentRatio(Number(inputRatio));
    if (reCalculateRatioCallback) reCalculateRatioCallback(Number(inputRatio));
  };
  const onClickRatio = (e) => {
    e.stopPropagation();
    setIsEditModel(true);
  };

  const showRatio = () => {
    if (currentCampaignType === GiftCampaignType.NORMAL) {
      if (configModel === ConfigModel.PRO) return false;
      if (abTestModel !== ABTest.GIFT) return false;
    }
    return !isEditModel;
  };

  const handleClickOutside = (event: any) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsEditModel(false);
    }
  };

  const getLatestGiftInfo = async (displayId) => {
    const gift = await getGiftPriceById(displayId, appId);
    setCurrentGift(gift);
  };

  const getItemsStr = () => {
    const items = currentGift?.items;
    if (!items) return;

    return items.reduce((preStr, item) => {
      return preStr
        .concat(item?.item.name)
        .concat(' ')
        .concat(`(${String(item?.quantity)})`)
        .concat(' ');
    }, '');
  };

  useEffect(() => {
    if (ratio) setCurrentRatio(ratio);
  }, [ratio]);

  useEffect(() => {
    const items = giftInfo.items;
    if (!items || items?.length === 0) getLatestGiftInfo(giftInfo.displayId);
    const clickListener = (event) => handleClickOutside(event);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  return (
    <div
      ref={divRef}
      className="h-36 border flex-col rounded-md flex gap-3 p-2 group w-[250px]"
    >
      <div className="flex justify-between flex-1 gap-2 w-full">
        <div className="bg-@tag-bg-3 h-5 flex justify-center items-center p-1 rounded-md text-@tag-text-3 font-bold ">
          <span> No {index}</span>
        </div>

        <div className="flex flex-col  gap-1 flex-1 pl-1">
          <div
            className="flex gap-1 justify-between items-center"
            style={{ fontWeight: 590 }}
          >
            <span className="truncate " style={{ width: '120px' }}>
              {currentGift?.name}
            </span>
            <Statistic
              suffix="¥"
              value={currentGift?.localPrice}
              valueStyle={{ fontSize: '12px' }}
            />
          </div>
          <p className="line-clamp-3 text-xs text-black/50">{getItemsStr()}</p>
        </div>
      </div>

      <div
        className={`flex gap-10 px-1  ${
          !showRatio() ? 'justify-end' : 'w-full'
        }`}
      >
        {showRatio() && (
          <span className="text-@MainGreen " onClick={(e) => onClickRatio(e)}>
            {Number(currentRatio * 100).toFixed(2)}%
          </span>
        )}

        <div className="flex gap-2 items-center w-full justify-end">
          {isEditModel && (
            <Input
              autoFocus
              className="border-@MainGreen rounded-md w-24 h-6"
              type="number"
              value={currentRatio}
              onChange={(e) => onChangeRatio(e.target.value)}
              onPressEnter={() => setIsEditModel(false)}
            />
          )}
          <div
            className="flex gap-1  items-center hover:cursor-pointer hover:opacity-70"
            onClick={() => onReplaceGiftCallback()}
          >
            <SyncOutlined className="text-@MainGreen" />

            <span className="text-xs">{t('gift.change')}</span>
          </div>
          <CloseOutlined
            className="hover:cursor-pointer hover:opacity-70 ml-4"
            onClick={() => onDeleteCallback()}
          />
        </div>
      </div>
    </div>
  );
}
