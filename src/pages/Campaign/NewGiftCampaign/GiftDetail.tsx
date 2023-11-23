import { getGiftPriceById } from '@/api/gift/levelup';
import { GiftInfo } from '@/types/gift';
import { Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function GiftDetail({ gift }): JSX.Element {
  const { t } = useTranslation();
  const [currentGift, setCurrentGift] = useState<GiftInfo>(gift);
  const { appId } = useSelector((store) => store.gift);

  const initData = async () => {
    const displayId = gift?.displayId;
    if (!displayId) return;
    const latestGfit = await getGiftPriceById(displayId, appId);
    latestGfit.localPrice = gift.localPrice;
    setCurrentGift(latestGfit);
  };

  useEffect(() => {
    // initData();
  }, []);

  return (
    <>
      {currentGift && (
        <div
          className="flex gap-1 flex-col rounded px-4 py-2"
          style={{ minWidth: '280px' }}
        >
          <span>{currentGift.name}</span>
          <div className="bg-gray-100" style={{ height: '1px' }} />
          <div className="flex gap-2 items-center">
            <span className="w-12 text-xs">Gift ID</span>
            <span className=" text-@MainGreen text-xs">
              {currentGift.displayId}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-12 text-xs">Item</span>
            <div className="flex flex-col gap-1 text-xs">
              {currentGift?.items?.map((item, index) => {
                return (
                  <span key={`gift_item_${item.item.name}_${index}`}>
                    {item?.item?.name} {item?.quantity}枚
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-12 text-xs">Price</span>
            <Statistic
              suffix="¥"
              value={currentGift.localPrice}
              valueStyle={{ fontSize: '14px' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
