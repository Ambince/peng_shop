import { updateCampaignStatus } from '@/api/gift/commonGampaign';
import { getGiftPriceById } from '@/api/gift/levelup';
import { NoticeModal } from '@/components/Gift/modal/NoticeModal';
import { useModal } from '@/pages/modal/ModalProvider';
import { eidtCampaign, setFlushPageType } from '@/store/giftSlice';
import { GiftCampaignType } from '@/types/gift';
import { EditOutlined } from '@ant-design/icons';
import { Button, Statistic, Switch } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export function GiftList({ campaignInfo, dissmiss, parentRef }): JSX.Element {
  const { t } = useTranslation();
  const { campaign, groups } = JSON.parse(JSON.stringify(campaignInfo));
  const { showModal, hideModal } = useModal();
  const dispatch = useDispatch();
  const divRef = useRef<any>(null);
  const { appId } = useSelector((store) => store.gift);

  const initData = async () => {
    for (const group of groups) {
      const displayId = group.giftInfo.displayId;
      if (!displayId) continue;
      const giftInfo: any = await getGiftPriceById(displayId, appId);
      group.giftInfo = giftInfo;
    }
  };

  const onChangeStatus = async (checked) => {
    await updateCampaignStatus(campaign?.id, checked);
    hideModal();
    dispatch(setFlushPageType({ type: GiftCampaignType.LEVEL_UP }));
  };

  const onEditCampaign = () => {
    dispatch(
      eidtCampaign({ record: campaignInfo, type: GiftCampaignType.LEVEL_UP }),
    );
    dissmiss();
  };

  const handleClickOutside = (event: any) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      !parentRef.current.contains(event.target)
    ) {
      dissmiss();
    }
  };

  useEffect(() => {
    initData();
    const clickListener = (event) => handleClickOutside(event);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  return (
    <div
      ref={divRef}
      className="flex flex-col gap-4 w-[504px]  p-3 min-h-[200px] no-scrollbar"
    >
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <span className="text-black/80 font-bold">Lv2</span>

          <span className="text-@textdiscription text-xs">
            ID : {campaign.id}
          </span>
        </div>
        <div className="flex gap-4 justify-center items-center">
          <Button
            className="border-@MainGreen text-@MainGreen"
            size="small"
            onClick={() => onEditCampaign()}
          >
            <EditOutlined />
            {t('common_edit')}
          </Button>
          <Switch
            checked={campaign?.status !== 'disabled'}
            checkedChildren="ON"
            className="w-14"
            unCheckedChildren="OFF"
            onChange={async (checked: boolean) => {
              showModal(
                <NoticeModal
                  content={
                    checked
                      ? t('gift.open_status_content')
                      : t('gift.close_status_content')
                  }
                  okDesc={t('confirm')}
                  success={() => onChangeStatus(checked)}
                  title={
                    checked
                      ? t('gift.open_status_title')
                      : t('gift.close_status_title')
                  }
                />,
              );
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-scroll no-scrollbar">
        {groups.map((group, i) => {
          return (
            <div
              key={`gift_list_${i}`}
              className="h-32 border flex-col rounded-md flex gap-3 p-2"
            >
              <div className="flex justify-between flex-1 gap-4 ">
                <div className="bg-@tag-bg-3 h-5 flex justify-center items-center p-1 rounded-md text-@tag-text-3 font-bold w-12">
                  No {i + 1}
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <div
                    className="flex gap-2 justify-between items-center "
                    style={{ fontWeight: 590 }}
                  >
                    <span className="truncate" style={{ width: '90px' }}>
                      {group.giftInfo?.name}
                    </span>
                    <Statistic
                      suffix="¥"
                      value={group.giftInfo?.localPrice}
                      valueStyle={{ fontSize: '12px' }}
                    />
                  </div>

                  <div className="text-black/50 w-full text-xs">
                    {group.giftInfo?.items?.map((item) => {
                      return (
                        <span key={item.item.displayId}>
                          {item.item.name} ({item.quantity})
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <span className="text-@MainGreen">{group.ratio}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
