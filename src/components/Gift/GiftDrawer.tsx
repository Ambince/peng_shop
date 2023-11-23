import {
  ABTest,
  ConfigModel,
  setABTest,
  setConfigModel,
  setNewCampaignInfo,
  updateCampaignByIndex,
} from '@/store/giftSlice';
import { CampaignInfo, GiftCampaignType } from '@/types/gift';
import { getZeroTime } from '@/utils/common';
import { CloseOutlined } from '@ant-design/icons';
import {
  DatePicker,
  DatePickerProps,
  Input,
  Radio,
  Select,
  Switch,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { AllFormTitle } from './AllFormTitle';
import { CategoryTitle } from './CategoryTitle';
import { List } from './icons/List';
import { Pie } from './icons/Pie';
import { Rocket } from './icons/Rocket';
import { Timer } from './icons/Timer';
import { Trace } from './icons/Trace';
import { ShopFormTitle } from './ShopFormTitle';
import { AllStrategy } from './strategy/AllStrategy';
import { LevelupStrategy } from './strategy/LevelupStrategy';
import { MilestoneStrategy } from './strategy/MilestoneStrategy';
import { NormalStrategy } from './strategy/NormalStrategy';
import { ShopStrategy } from './strategy/ShopStrategy';

export function GiftDrawer({ closeCallback }): JSX.Element {
  const { t } = useTranslation();
  const [testType, setTestType] = useState(ABTest.TRIGGER);
  const [openHistoryRetention, setOpenHistoryRetention] = useState(false);
  const [isABTest, setIsABTest] = useState(false);
  const dispatch = useDispatch();
  const [currentCampagnInfo, setCurrentCampagnInfo] = useState<
    CampaignInfo | undefined
  >();

  const {
    currentCampaignType,
    currentCampaignInfos,
    isEdit,
    configModel,
    application,
  } = useSelector((store) => store.gift);

  const targets = [
    {
      label: t('common.auxin_existing_user,auxin_new_user'),
      value: 'auxin_existing_user,auxin_new_user',
    },
    { label: t('auxin_existing_user'), value: 'auxin_existing_user' },
    { label: t('auxin_new_user'), value: 'auxin_new_user' },
  ];
  const [targetOptions, setTargetOptions] = useState<any[]>();

  const autoAddType = [
    GiftCampaignType.ALL,
    GiftCampaignType.NORMAL,
    GiftCampaignType.SHOP,
  ];
  const strategyMap = new Map<string, any>([
    [GiftCampaignType.ALL, <AllStrategy />],
    [GiftCampaignType.LEVEL_UP, <LevelupStrategy />],
    [GiftCampaignType.MILESTONE, <MilestoneStrategy />],
    [GiftCampaignType.NORMAL, <NormalStrategy />],
    [GiftCampaignType.SHOP, <ShopStrategy />],
  ]);

  const initCampaignInfo = (retains?) => {
    const autoAdd = autoAddType.includes(currentCampaignType);
    const params = { init: true, autoAdd, retains };
    dispatch(setNewCampaignInfo({ params }));
  };

  const initData = async () => {};

  useEffect(() => {
    initData();
    if (isEdit) return;
    const retains = {} as any;
    if (currentCampaignType === GiftCampaignType.NORMAL) {
      retains.startAt = getZeroTime();
    }

    initCampaignInfo(retains);
  }, []);

  useEffect(() => {
    if (!currentCampaignInfos) return;
    const campaignInfo: CampaignInfo = currentCampaignInfos[0];
    if (!campaignInfo) return;
    if (campaignInfo?.campaign?.historyRetention) setOpenHistoryRetention(true);
    const purpose: any = campaignInfo.campaign.purpose;
    if (Number(purpose) === ConfigModel.PRO) {
      dispatch(setConfigModel({ model: ConfigModel.PRO }));
    }
    if (Number(purpose) === ABTest.GIFT) {
      setIsABTest(true);
      dispatch(setABTest({ model: ABTest.GIFT }));
      setTestType(ABTest.GIFT);
    }
    if (Number(purpose) === ABTest.TRIGGER) {
      setIsABTest(true);
      dispatch(setABTest({ model: ABTest.TRIGGER }));
      setTestType(ABTest.TRIGGER);
    }

    setCurrentCampagnInfo(campaignInfo);
  }, [currentCampaignInfos]);

  const updateCamaign = (params: { [key: string]: any }) => {
    const campaignInfo: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    Object.keys(params).forEach((key) => {
      campaignInfo.campaign[key] = params[key];
    });
    dispatch(updateCampaignByIndex({ index: 0, campaign: campaignInfo }));
  };

  const onChangeUser = (segmentName: string) => {
    if (!segmentName) return;
    updateCamaign({ segmentName });
  };

  const onChangeStartAt: DatePickerProps['onChange'] = (_, dateString) => {
    updateCamaign({ startAt: new Date(dateString).getTime() });
  };

  const onChangeEndAt: DatePickerProps['onChange'] = (_, dateString) => {
    updateCamaign({ endAt: new Date(dateString).getTime() });
  };

  const onChangeOpenHistoryRetention = (openHistoryRetention) => {
    setOpenHistoryRetention(openHistoryRetention);
  };

  const getSegmentName = () => {
    if (!currentCampagnInfo) return;
    const segmentName = currentCampagnInfo?.campaign?.segmentName;
    if (Array.isArray(segmentName)) {
      let name: string = segmentName[0];
      for (let i = 1; i < segmentName.length; i++) {
        name = name.concat(',').concat(segmentName[i]);
      }
      return name;
    }
    return segmentName;
  };

  const getRetains = () => {
    const segmentName = getSegmentName();
    const id = currentCampagnInfo?.campaign?.id;
    const historyRetention = currentCampagnInfo?.campaign?.historyRetention;
    const startAt = currentCampagnInfo?.campaign?.startAt;
    const endAt = currentCampagnInfo?.campaign?.endAt;

    return { startAt, endAt, segmentName, historyRetention, id };
  };
  const onChangeABType = (model) => {
    const retains = getRetains();
    initCampaignInfo(retains);
    setTestType(model);
    dispatch(setABTest({ model }));
  };

  const getShowDatePicker = () => {
    return currentCampaignType === GiftCampaignType.NORMAL;
  };
  const getShowTargetUser = () => {
    if (currentCampaignType === GiftCampaignType.ALL) return false;
    if (currentCampaignType === GiftCampaignType.SHOP) return false;
    return true;
  };

  const getTargetUserDisable = () => {
    if (currentCampaignType === GiftCampaignType.NORMAL) return false;
    if (currentCampaignType === GiftCampaignType.SHOP) return false;
    return true;
  };

  const onChangeABStatus = (open: boolean) => {
    const retains = getRetains();
    initCampaignInfo(retains);
    setIsABTest(open);
    dispatch(setConfigModel({ model: ConfigModel.QUICK }));
    if (open) dispatch(setABTest({ model: ABTest.TRIGGER }));
    else dispatch(setABTest({ model: null }));
  };

  const onChangeConfitModel = () => {
    const retains = getRetains();
    initCampaignInfo(retains);
    dispatch(setABTest({ model: null }));
    setIsABTest(false);
    const model =
      configModel === ConfigModel.QUICK ? ConfigModel.PRO : ConfigModel.QUICK;
    dispatch(setConfigModel({ model }));
  };
  return (
    <div className="w-full h-full relative overflow-scrol ">
      {/* title */}
      <div className="flex justify-between h-16 items-center px-3 ">
        <div>
          {currentCampaignType !== GiftCampaignType.ALL ? (
            <>
              <span className="font-bold">{application?.title}</span>
              <span>｜</span>
              <span className="text-@textdiscription">
                {t(`common.${currentCampaignType}`)}
              </span>
            </>
          ) : (
            <span className="font-bold">{t('gift.new_campaign')}</span>
          )}
        </div>
        <CloseOutlined onClick={() => closeCallback()} />
      </div>
      <div className="bg-@border1 h-[1px]" />

      {/* 活动目标设置 */}
      <div className="flex px-8 gap-8">
        <div className="flex flex-col gap-6 pt-8">
          <CategoryTitle title={t('gift.campaign_target')} />

          {currentCampaignType === GiftCampaignType.ALL &&
            currentCampaignInfos.length > 0 && <AllFormTitle />}

          {currentCampaignType === GiftCampaignType.SHOP &&
            currentCampaignInfos.length > 0 && <ShopFormTitle />}

          {/* 目标用户 */}
          {getShowTargetUser() && (
            <div className="flex gap-3 items-center h-8  ">
              <div className="flex items-center gap-2 w-36">
                <Trace className="text-@MainGreen flex" />
                <span className="font-bold text-@textheading">
                  {t('form_target_user')}
                </span>
              </div>

              <Select
                className="w-64 rounded"
                defaultValue={`${t(
                  'common.auxin_existing_user,auxin_new_user',
                )}`}
                disabled={getTargetUserDisable()}
                options={targetOptions}
                value={getSegmentName()}
                onChange={onChangeUser}
              />
            </div>
          )}

          {getShowDatePicker() && (
            <div className="flex gap-3 items-center h-8  ">
              <div className="flex items-center gap-2 w-36">
                <Timer className="text-@MainGreen  flex " />
                <span className="font-bold text-@textheading">
                  {t('gift.time')}
                </span>
              </div>

              {currentCampagnInfo?.campaign?.startAt && (
                <DatePicker
                  className="w-30 rounded"
                  defaultValue={moment(currentCampagnInfo?.campaign?.startAt)}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  onChange={onChangeStartAt}
                />
              )}

              {!currentCampagnInfo?.campaign?.startAt && (
                <DatePicker
                  className="w-30 rounded"
                  placeholder={t('gift.start_time')}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  onChange={onChangeStartAt}
                />
              )}

              <span>～</span>

              {currentCampagnInfo?.campaign?.endAt && (
                <DatePicker
                  className="w-30 rounded"
                  defaultValue={moment(currentCampagnInfo?.campaign?.endAt)}
                  format="YYYY/MM/DD HH:mm:ss"
                  onChange={onChangeEndAt}
                />
              )}

              {!currentCampagnInfo?.campaign?.endAt && (
                <DatePicker
                  className="w-30 rounded"
                  format="YYYY/MM/DD HH:mm:ss"
                  placeholder={t('gift.end_time')}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  onChange={onChangeEndAt}
                />
              )}
            </div>
          )}

          {currentCampaignType === GiftCampaignType.NORMAL && (
            <div className="flex gap-14 h-8">
              <div className="flex items-center gap-3 ml-40">
                <span>{t('regular_campagin')}</span>
                <Switch
                  checked={openHistoryRetention}
                  defaultChecked={openHistoryRetention}
                  size="small"
                  onChange={onChangeOpenHistoryRetention}
                />
              </div>
              {openHistoryRetention && (
                <div className="gap-3 flex items-center">
                  <span>{t('every')}</span>
                  <Input
                    className="w-16"
                    value={currentCampagnInfo?.campaign?.historyRetention}
                    onChange={(e) =>
                      updateCamaign({ historyRetention: e.target.value })
                    }
                  />
                  <span>{t('gift.regular_desc')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 运营策略 */}
      <div className="flex px-8 mt-10 flex-col ">
        <div className="flex justify-between w-full pb-8">
          <CategoryTitle
            color={`${
              configModel === ConfigModel.QUICK ? '@MainGreen' : '@tag-text-3'
            } `}
            title={t('gift.strategy')}
          />
          {currentCampaignType === GiftCampaignType.NORMAL && (
            <div className="flex items-center gap-3">
              <span
                className={` ${
                  configModel === ConfigModel.QUICK
                    ? ' text-@MainGreen'
                    : ' text-@tag-text-3'
                }  `}
              >
                {t('common.cur_model')}
              </span>
              <div
                className={`flex gap-2 items-center ${
                  configModel === ConfigModel.QUICK
                    ? 'bg-@light2green text-@MainGreen'
                    : 'bg-@tag-bg-3 text-@tag-text-3'
                }  rounded h-8 px-4 hover:cursor-pointer hover:opacity-70`}
                onClick={() => onChangeConfitModel()}
              >
                {configModel === ConfigModel.QUICK && (
                  <>
                    <Rocket className="flex" />
                    <span>{t('common.quick')}</span>
                  </>
                )}
                {configModel === ConfigModel.PRO && (
                  <>
                    <List className="flex" />
                    <span>{t('common.pro')}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AB测试 */}
        {currentCampaignType === GiftCampaignType.NORMAL &&
          configModel !== ConfigModel.PRO && (
            <div className="flex flex-col gap-4 px-4 bg-@lightbggrey rounded-t-lg pt-4">
              <div className="flex gap-2 items-center">
                <Pie className="text-@MainGreen flex" />
                <span className="font-bold">{t('common.ab_test')}</span>
                <Switch
                  checked={isABTest}
                  onChange={(open) => onChangeABStatus(open)}
                />
                <span className="text-xs  text-@textdiscription">
                  {t('common.ab_test_tip')}
                </span>
              </div>
              {isABTest && (
                <Radio.Group
                  className="ml-6"
                  value={testType}
                  onChange={(e) => onChangeABType(e.target.value)}
                >
                  <Radio value={ABTest.TRIGGER}>{t('gift.test_trigger')}</Radio>
                  <Radio value={ABTest.GIFT}>{t('gift.test_gift')}</Radio>
                </Radio.Group>
              )}

              <div className="h-[1px] bg-@border1" />
            </div>
          )}

        {/* 配置body */}
        {strategyMap.get(currentCampaignType)}
      </div>
    </div>
  );
}
