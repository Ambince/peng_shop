import {
  create as allCreate,
  update as allUpdate,
  getGamesByType,
} from '@/api/gift/commonGampaign';
import {
  create as levelupCreate,
  update as levelupUpdate,
} from '@/api/gift/levelup';
import {
  create as milestoneCreate,
  update as milestoneUpdate,
} from '@/api/gift/milestone';
import {
  create as normalCreate,
  update as normalUpdate,
} from '@/api/gift/normal';
import {
  clearCampaign,
  getLevelInfo,
  setAllGames,
  setApplication,
  setCurrentGiftType,
  setFlushPageType,
} from '@/store/giftSlice';
import {
  CampaignInfo,
  GIFT_LOCAL,
  GameInfo,
  GiftCampaignType,
  TriggerType,
} from '@/types/gift';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Popover, notification } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GiftCampaignTypeSelect } from './GiftCampaignTypeSelect';
import { GiftDrawer } from './GiftDrawer';

export function GiftTitile({ filter = 'normal' }): JSX.Element {
  const [open, setOpen] = useState(false);
  const [isShowSelect, setIsShowSelect] = useState(false);
  const [games, setGames] = useState<GameInfo[]>([]);
  const parentRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const [openPop, setOpenPop] = useState(false);
  const {
    currentCampaignType,
    isEdit,
    currentCampaignInfos,
    application,
    allGames,
    isCopy,
    isCreate,
    appId,
    configModel,
    abTestModel,
  } = useSelector((store) => store.gift);
  const dispatch = useDispatch();

  const createRequestProxyMap: Map<string, any> = new Map([
    [GiftCampaignType.NORMAL, [normalCreate, normalUpdate]],
    [GiftCampaignType.LEVEL_UP, [levelupCreate, levelupUpdate]],
    [GiftCampaignType.MILESTONE, [milestoneCreate, milestoneUpdate]],
    [GiftCampaignType.ALL, [allCreate, allUpdate]],
    [GiftCampaignType.SHOP, [allCreate, allUpdate]],
  ]);

  const initData = async () => {
    const res: any = await getGamesByType(filter);
    const latestGames = res.info;
    dispatch(setAllGames({ games: latestGames }));
    if (!application) {
      const localApp = localStorage.getItem(GIFT_LOCAL.APP);
      if (localApp) {
        const game = JSON.parse(localApp);
        dispatch(setApplication({ game }));
      } else {
        dispatch(setApplication({ game: latestGames[0] }));
      }
    }
    setGames(latestGames);
  };

  const showNoticeInfo = (type, message, description) => {
    notification[type]({ message, description });
  };

  const onClose = () => {
    if (currentCampaignType === GiftCampaignType.LEVEL_UP) {
      // @ts-ignore
      dispatch(getLevelInfo(appId));
    }
    dispatch(setFlushPageType({ type: currentCampaignType }));
    setOpen(false);
    dispatch(clearCampaign());
  };

  const onSelectCampaignTypeCallback = (type: string) => {
    setOpenPop(!openPop);
    setOpen(true);
    dispatch(setCurrentGiftType({ type }));
  };

  const onCreateOrUpdateCampaign = async () => {
    setLoading(true);
    if (currentCampaignType === GiftCampaignType.LEVEL_UP) {
      // @ts-ignore
      dispatch(getLevelInfo(appId));
    }
    const proxyArray = createRequestProxyMap.get(currentCampaignType);
    const info: CampaignInfo[] = JSON.parse(
      JSON.stringify(currentCampaignInfos),
    );
    const purpose = abTestModel || configModel;
    info.forEach((item) => (item.campaign.purpose = purpose));
    // super admin TriggerType.LEVEL_UP 类型的 需要将maxLevel==null 设置为MAX
    if (currentCampaignType === GiftCampaignType.ALL) {
      info.forEach((item) =>
        item.groups.forEach((group) => {
          group.ruleGroups.forEach((rule) => {
            rule.ruleList.forEach((ruleItem) => {
              if (
                ruleItem.conditionName === TriggerType.LEVEL_UP &&
                !ruleItem.parameters.maxLevel
              ) {
                ruleItem.parameters.maxLevel = String(Number.MAX_SAFE_INTEGER);
              }
            });
          });
        }),
      );
    }
    const isUpdate = isEdit && !isCopy;
    const isSuccess = await proxyArray[isUpdate ? 1 : 0](info);
    if (!isSuccess) {
      showNoticeInfo(
        'error',
        'Campaign Error',
        `${isUpdate ? 'create' : 'update'}  error`,
      );
      setLoading(false);
      return;
    }
    onClose();
    showNoticeInfo(
      'success',
      `${isUpdate ? 'Create' : 'Update'} Campaign`,
      `${isUpdate ? 'create' : 'update'} campaign success`,
    );

    setLoading(false);
  };

  const isSingle = () => {
    if (currentCampaignType === GiftCampaignType.ALL) return true;
    if (currentCampaignType === GiftCampaignType.SHOP) return true;
    return false;
  };

  const onSelectCampaign = () => {
    if (!isSingle()) {
      setOpenPop(!openPop);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    initData();
    if (isEdit) setOpen(true);
  }, [isEdit]);

  useEffect(() => {
    if (isCreate) {
      initData();
      setOpen(true);
    }
  }, [isCreate]);

  const footerComponent = () => {
    return (
      <div className="flex justify-end ">
        <Button
          icon={<CheckCircleOutlined />}
          loading={loading}
          type="primary"
          onClick={() => onCreateOrUpdateCampaign()}
        >
          <span>{t('common.done')}</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex pt-8 gap-6 items-center  ">
      {/* Button */}
      <Popover
        arrowPointAtCenter={false}
        className="p-0 m-0"
        content={
          <GiftCampaignTypeSelect
            callback={(type) => onSelectCampaignTypeCallback(type)}
            dissmiss={() => setOpenPop(false)}
            parentRef={parentRef}
          />
        }
        destroyTooltipOnHide
        open={openPop}
        placement="bottom"
        trigger="click"
      >
        <Button
          ref={parentRef}
          className="h-10 px-2 ml-5"
          icon={<PlusOutlined />}
          style={{ minWidth: '136px' }}
          type="primary"
          onClick={() => onSelectCampaign()}
        >
          {t('gift.new_campaign')}
        </Button>
      </Popover>

      <Drawer
        bodyStyle={{ padding: 0 }}
        closable={false}
        destroyOnClose
        footer={footerComponent()}
        maskClosable
        open={open}
        placement="right"
        size="large"
        width={800}
        zIndex={900}
        onClose={onClose}
      >
        <GiftDrawer closeCallback={onClose} />
      </Drawer>
    </div>
  );
}
