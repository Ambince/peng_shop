import { getGiftPriceById } from '@/api/gift/levelup';
import { updateCampaignByIndex } from '@/store/giftSlice';
import { CampaignInfo, GiftInfo, GiftWidgetMode, Group } from '@/types/gift';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GiftContainer } from '../../GiftContainer';

const { Search } = Input;
export function CreateGroupGfit({ groupIndex }): JSX.Element {
  const { currentCampaignInfos, application } = useSelector(
    (store) => store.gift,
  );
  const dispatch = useDispatch();
  const [gift, setGift] = useState<GiftInfo | null>();
  const [isOpenIFrame, setIsOpenIFrame] = useState<boolean>(false);
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
    const currentGroup = groups[groupIndex];
    if (!currentGroup) return;
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
    dispatch(updateCampaignByIndex({ index: 0, campaign }));
    setIsOpenIFrame(!isOpenIFrame);
    setGift(internalGiftInfo);
  };

  const showGiftInputInfo = () => {
    if (!gift) return '';
    const displayId = gift?.displayId;
    const name = gift?.name;
    const price = `${gift?.localPrice}￥`;
    return `${displayId} ${name} ${price}`;
  };

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campainInfo: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    if (!campainInfo) return;
    setCurrentCampaign(campainInfo);
    const group: Group = campainInfo.groups[groupIndex];
    if (!group?.giftInfo) return;
    setGift(group.giftInfo);
  }, [currentCampaignInfos]);

  return (
    <div className="color-red-500">
      {isOpenIFrame && (
        <GiftContainer
          dissmiss={() => setIsOpenIFrame(!isOpenIFrame)}
          props={props}
          success={(giftInfo) => onSelectGiftSuccess(giftInfo)}
        />
      )}

      <Search
        className="w-64"
        placeholder="search gfit"
        value={showGiftInputInfo()}
        onSearch={() => setIsOpenIFrame(true)}
      />
    </div>
  );
}
