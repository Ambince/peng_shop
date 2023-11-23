import { fetchContens } from '@/api/super/contents';
import { updateCampaignByIndex } from '@/store/giftSlice';
import { Campaign, CampaignInfo, GiftCampaignType } from '@/types/gift';
import { ContentType } from '@/types/super_admin';
import {
  getTimestampDaysFromNow,
  getZeroTime,
  hourtimestamp,
  timeFormat,
} from '@/utils';
import { DatePicker, DatePickerProps, Input, Select, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { MultiRectangle } from './icons/MultiRectangle';
import { Timer } from './icons/Timer';
import { Trace } from './icons/Trace';

export function ShopFormTitle(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const defaultScheduler = { startTimeCron: '0 0 0 * * 1', duration: 24 };
  const [campaign, setCampaign] = useState<Campaign | null>();

  const { currentCampaignInfos, appId, isEdit } = useSelector(
    (store) => store.gift,
  );
  const [selectSegmentName, setSelectSegmentName] = useState<string>(
    'auxin_existing_user,auxin_new_user',
  );

  const [week, setWeek] = useState<number>(1);
  const [unit, setUnit] = useState<string>('day');
  const [weekOptions, setWeekOptions] = useState<any[]>([]);
  const [time, setTime] = useState<string>('1');
  const [duration, setDuration] = useState<number>(24);
  const [cycle, setCycle] = useState<boolean>(true);
  const [timeTip, setTimeTip] = useState<string>('');
  const [cron, setCron] = useState<string>('');

  const timeOptions = [
    { label: t('day'), value: 'day' },
    { label: t('hour'), value: 'hour' },
  ];

  const targets = [
    {
      label: t('common.auxin_existing_user,auxin_new_user'),
      value: 'auxin_existing_user,auxin_new_user',
    },
    { label: t('internal_test'), value: 'internal_test' },
  ];

  const onChangeParameter = (
    params: { [key: string]: any },
    contentId?: string,
  ) => {
    if (!isEdit) params.name = `${appId}_shop_${Date.now()}`;
    if (params.scheduler) setCron(params.scheduler.startTimeCron);

    const campaignInfo: CampaignInfo = JSON.parse(
      JSON.stringify(currentCampaignInfos[0]),
    );
    Object.keys(params).forEach((key) => {
      campaignInfo.campaign[key] = params[key];
    });
    if (contentId) campaignInfo.groups[0].contentId = Number(contentId);
    setCampaign(campaignInfo.campaign);
    dispatch(updateCampaignByIndex({ index: 0, campaign: campaignInfo }));
  };

  const onChangeUnit = (curUnit) => {
    let curDuration;
    if (curUnit === 'day') {
      setTime(Number(Number(time) / 24).toFixed(1));
      curDuration = Number(time);
    } else {
      setTime(Number(Number(time)).toString());
      curDuration = Number(time);
    }
    setUnit(curUnit);
    setDuration(curDuration);
    const startTimeCron = campaign?.scheduler?.startTimeCron;
    const scheduler = { startTimeCron, duration: curDuration };
    onChangeParameter({ scheduler });
  };

  const onChangeTime = (time) => {
    let curDuration;
    if (unit === 'day') {
      curDuration = Number(time) * 24;
    } else {
      curDuration = Number(time);
    }
    setDuration(curDuration);
    const startTimeCron = campaign?.scheduler?.startTimeCron;
    const scheduler = { startTimeCron, duration: curDuration };
    onChangeParameter({ scheduler });
    setTime(time);
  };

  const onChangeWeek = (curWeek) => {
    const prefix = '0 0 0 * *';
    const startTimeCron = prefix.concat(' ').concat(curWeek);
    const preDuration = campaign?.scheduler?.duration ?? 0;
    const scheduler = { startTimeCron, duration: preDuration };
    onChangeParameter({ scheduler });
    setWeek(curWeek);
  };

  const onChangeCycle = (open: boolean) => {
    if (open) {
      onChangeParameter({ startAt: 0, endAt: 0 });
    } else {
      onChangeParameter({ scheduler: null, startAt: getZeroTime() });
    }
    setCycle(open);
  };

  const onChangeStartAt: DatePickerProps['onChange'] = (_, dateString) => {
    onChangeParameter({ startAt: new Date(dateString).getTime() });
  };

  const onChangeEndAt: DatePickerProps['onChange'] = (_, dateString) => {
    onChangeParameter({ endAt: new Date(dateString).getTime() });
  };

  const showStart = () => {
    if (campaign?.startAt) return true;
    return false;
  };

  const showEnd = () => {
    if (campaign?.endAt) return true;
    return false;
  };

  const initData = async (preCampaign: Campaign) => {
    const { info } = await fetchContens({
      contentType: ContentType.SHOP,
      pageIndex: 0,
      itemsPerPage: 1,
    });
    console.info(`[contentId]`, info[0].id);
    const prefix = 'week_';
    const options: any[] = [];
    for (let value = 0; value < 7; value++) {
      options.push({ label: t(`${prefix}${value}`), value });
    }
    const preDuration = preCampaign.scheduler?.duration;
    const preStartTimeCron = preCampaign.scheduler?.startTimeCron;
    if (preDuration) setTime(String(Number(preDuration) / 24));
    if (preStartTimeCron) {
      const cronArray = preStartTimeCron.split(' ');
      setWeek(Number(cronArray[cronArray.length - 1]));
    }
    const parameters: any = {
      type: GiftCampaignType.SHOP,
      historyRetention: 8,
      priority: 100000,
    };
    if (isEdit) {
      if (!preCampaign.scheduler) setCycle(false);
    } else if (!preCampaign.scheduler) parameters.scheduler = defaultScheduler;
    setWeekOptions(options);
    onChangeParameter(parameters, info[0].id);
  };

  useEffect(() => {
    const campaignInfo: CampaignInfo = currentCampaignInfos[0];
    if (!campaignInfo) return;
    const preCampaign = campaignInfo.campaign;
    if (!preCampaign) return;
    const segmentName = preCampaign?.segmentConfig?.segmentName;
    if (segmentName) setSelectSegmentName(segmentName);
    setCampaign(preCampaign);
    initData(preCampaign);
  }, []);

  useEffect(() => {
    const cronArray = cron.split(' ');
    const weekNum = Number(cronArray[cronArray.length - 1]);
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const afterGap = 7 - (dayOfWeek - weekNum);
    const preGap = weekNum - dayOfWeek;
    const num = weekNum > dayOfWeek ? preGap : afterGap;
    const timestamp = getTimestampDaysFromNow(num);
    const startTime = timeFormat(timestamp);
    const endTime = timeFormat(timestamp + duration * hourtimestamp - 1000);
    setTimeTip(`${startTime} -- ${endTime}`);
  }, [cron, duration, week]);

  return (
    <div className="w-full  gap-6 flex flex-col">
      <div className="flex gap-3 items-center h-8  ">
        <div className="flex items-center gap-2 w-48">
          <Trace className="text-@MainGreen flex" />
          <span className="font-bold text-@textheading">
            {t('form_target_user')}
          </span>
        </div>

        <Select
          className="w-48 rounded"
          options={targets}
          value={selectSegmentName}
          onChange={(segmentName) => {
            onChangeParameter({ segmentName });
            setSelectSegmentName(segmentName);
          }}
        />
      </div>

      <div className="flex gap-3 items-center h-8  ">
        <div className="flex items-center gap-2 w-48">
          <MultiRectangle className="text-@MainGreen flex" />
          <span className="font-bold text-@textheading">
            {t('shop.regular')}
          </span>
        </div>

        <Switch
          checked={cycle}
          checkedChildren="OPEN"
          unCheckedChildren="CLOSE"
          onChange={(checked) => onChangeCycle(checked)}
        />
      </div>

      {cycle && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center h-8  ">
            <div className="flex items-center gap-2 w-48">
              <Timer className="text-@MainGreen  flex " />
              <span className="font-bold text-@textheading">
                {t('shop.start')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>{t('every_week')}</span>
                {weekOptions.length > 0 && (
                  <Select
                    className="w-24"
                    defaultValue={week}
                    options={weekOptions}
                    onChange={(val) => onChangeWeek(val)}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>{t('shop_duration')}</span>

                <Input
                  className="w-24"
                  type="number"
                  value={time}
                  onChange={(e) => onChangeTime(e.target.value)}
                />
                <Select
                  className="w-20"
                  defaultValue={unit}
                  options={timeOptions}
                  onChange={(val) => onChangeUnit(val)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end text-xs gap-2 mt-3">
            <span>{t('shop.start_desc')}</span>
            <span className=" text-@MainGreen font-bold">{timeTip}</span>
          </div>
        </div>
      )}

      {!cycle && (
        <div className="flex gap-3 items-center h-8  ">
          <div className="flex items-center gap-2 w-48">
            <Timer className="text-@MainGreen  flex " />
            <span className="font-bold text-@textheading">
              {t('gift.time')}
            </span>
          </div>

          {showStart() && (
            <DatePicker
              className="w-30 rounded"
              defaultValue={moment(campaign?.startAt)}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              onChange={onChangeStartAt}
            />
          )}

          {!showStart() && (
            <DatePicker
              className="w-30 rounded"
              placeholder={t('gift.start_time')}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              onChange={onChangeStartAt}
            />
          )}

          <span>～</span>

          {showEnd() && (
            <DatePicker
              className="w-30 rounded"
              defaultValue={moment(campaign?.endAt)}
              format="YYYY/MM/DD HH:mm:ss"
              onChange={onChangeEndAt}
            />
          )}

          {!showEnd() && (
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
    </div>
  );
}
