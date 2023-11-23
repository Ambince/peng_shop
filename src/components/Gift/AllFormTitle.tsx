import { getCampaignTypes } from '@/api/gift/campaign';
import { SelectProps, getGames } from '@/api/gift/commonGampaign';
import { setAllGames, updateCampaignByIndex } from '@/store/giftSlice';
import { Campaign, CampaignInfo } from '@/types/gift';
import { DatePicker, DatePickerProps, Input, Select, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { IconTile } from './IconTitle';

interface Option {
  label: string;
  value: string;
}

export function AllFormTitle(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openRegular, setOpenRegular] = useState(false);
  const [repeatable, setRepeatable] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>();
  const [appIds, setAppIds] = useState<Option[]>([]);
  const [campainTypes, setCampainTypes] = useState<Option[]>([]);

  const { allGames, currentCampaignInfos } = useSelector((store) => store.gift);
  const [selectAppId, setSelectAppId] = useState<any[]>(['all']);
  const [selectLang, setSelectLang] = useState<any[]>(['all']);
  const [selectSegmentName, setSelectSegmentName] = useState<string>(
    'auxin_existing_user,auxin_new_user',
  );
  const [exceptSegmentName, setExceptSegmentName] = useState<string>('');

  const langOptions = [
    { label: 'all', value: 'all' },
    { label: 'ja', value: 'ja' },
    { label: 'en', value: 'en' },
    { label: 'zh-TW', value: 'zh-TW' },
  ];

  const targets = [
    {
      label: t('common.auxin_existing_user,auxin_new_user'),
      value: 'auxin_existing_user,auxin_new_user',
    },
    { label: t('auxin_existing_user'), value: 'auxin_existing_user' },
    { label: t('auxin_new_user'), value: 'auxin_new_user' },
  ];

  const [targetOptions, setTargetOptions] = useState<any[]>();

  const onChangeParameter = (params) => {
    if (!campaign) return;
    const copyCampaign: Campaign = JSON.parse(JSON.stringify(campaign));
    const { groups } = JSON.parse(JSON.stringify(currentCampaignInfos[0]));
    Object.keys(params).forEach((key) => {
      copyCampaign[key] = params[key];
    });
    setCampaign(copyCampaign);
    const updateOne = { campaign: copyCampaign, groups };
    dispatch(updateCampaignByIndex({ index: 0, campaign: updateOne }));
  };

  const onChangeSelect = (value: any[], field: string) => {
    console.info(`[value]`, value);
    const lastAll = value[value.length - 1] === 'all';
    const validValus = value.filter((item) => item !== 'all');
    let valueArray;
    if (!lastAll) {
      valueArray = validValus;
      if (field === 'appId') setSelectAppId(validValus);
      if (field === 'lang') setSelectLang(validValus);
    } else {
      if (field === 'appId') setSelectAppId(['all']);
      if (field === 'lang') setSelectLang(['all']);
    }
    onChangeParameter({ [field]: valueArray });
  };

  const onChangeStartAt: DatePickerProps['onChange'] = (_, dateString) => {
    onChangeParameter({ startAt: new Date(dateString).getTime() });
  };

  const onChangeEndAt: DatePickerProps['onChange'] = (_, dateString) => {
    onChangeParameter({ endAt: new Date(dateString).getTime() });
  };

  const initData = async () => {
    const res: any = await getGames();
    const games = res.info;
    dispatch(setAllGames({ games }));
    const ids: SelectProps[] = games.map((game) => ({
      label: game.appId,
      value: game.appId,
    }));
    ids.unshift({ label: 'all', value: 'all' });
    setAppIds(ids);

    const { info } = await getCampaignTypes();
    const typeOptions = info.map((value) => ({ label: value, value }));
    setCampainTypes(typeOptions);

    setTargetOptions(targets);
  };

  useEffect(() => {
    initData();
    const campaignInfo: CampaignInfo = currentCampaignInfos[0];
    if (!campaignInfo) return;
    const preCampaign = campaignInfo.campaign;
    if (!preCampaign) return;
    if (preCampaign.historyRetention) setOpenRegular(true);
    if (preCampaign.appId) {
      setSelectAppId(preCampaign.appId as any);
    }
    if (preCampaign.lang) {
      setSelectLang(preCampaign.lang as any);
    }
    setRepeatable(preCampaign.isRepeatable);
    const segmentName = preCampaign?.segmentConfig?.segmentName;
    if (segmentName) setSelectSegmentName(segmentName);
    const excepts = preCampaign.excludeSegmentName;
    if (excepts?.length === 1) setExceptSegmentName(excepts[0]);
    if (excepts?.length === 2)
      setExceptSegmentName(`${excepts[0]}_${excepts[1]}`);
    setCampaign(preCampaign);
  }, []);

  return (
    <div className="w-full  gap-6 flex flex-col">
      <div className="flex gap-4 ">
        <IconTile icon="sort" title={t('gift.name')} />
        <Input
          className="w-full rounded-md"
          value={campaign?.name}
          onChange={(e) => onChangeParameter({ name: e.target.value })}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="gift" title={`${t('gift.type')}*`} />
        <Select
          className="w-[480px]"
          options={campainTypes}
          value={campaign?.type}
          onSelect={(type) => onChangeParameter({ type })}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="game" title={`${t('gift.appId')}*`} />
        <Select
          allowClear
          mode="multiple"
          options={appIds}
          placeholder="all"
          style={{ width: '100%' }}
          value={selectAppId}
          onChange={(value) => onChangeSelect(value, 'appId')}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="translate" title={`${t('language')}*`} />
        <Select
          allowClear
          mode="multiple"
          options={langOptions}
          placeholder="all"
          style={{ width: '100%' }}
          value={selectLang}
          onChange={(value) => onChangeSelect(value, 'lang')}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="sort" title={t('gift.priority')} />
        <Input
          className="w-20 rounded-md"
          value={campaign?.priority}
          onChange={(e) => onChangeParameter({ priority: e.target.value })}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="exclusive" title={t('gift.exclusive')} />
        <Input
          className="rounded-md"
          value={campaign?.exclusiveType}
          onChange={(e) => onChangeParameter({ exclusiveType: e.target.value })}
        />
      </div>
      <div className="flex gap-4 ">
        <IconTile icon="refresh" title={`${t('gift.repeatable')}*`} />
        <Switch
          checked={repeatable}
          checkedChildren="YES"
          unCheckedChildren="NO"
          onChange={(isRepeatable) => {
            setRepeatable(isRepeatable);
            onChangeParameter({ isRepeatable });
          }}
        />
      </div>
      <div className="flex gap-4 flex-col">
        <div className="flex gap-4 ">
          <IconTile icon="target" title={`${t('gift.target_user')}*`} />
          <Select
            allowClear
            options={targetOptions}
            style={{ width: '100%' }}
            value={selectSegmentName}
            onChange={(value) => {
              onChangeParameter({
                segmentName: value ?? 'auxin_existing_user,auxin_new_user',
              });
              setSelectSegmentName(
                value ?? 'auxin_existing_user,auxin_new_user',
              );
            }}
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span>{t('gift.except')}</span>
          <Select
            allowClear
            options={targetOptions}
            style={{ width: '70%' }}
            value={exceptSegmentName}
            onChange={(excludeSegmentName) => {
              onChangeParameter({ excludeSegmentName });
              setExceptSegmentName(excludeSegmentName);
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 items-center ">
        <IconTile icon="time" title={t('form_duration')} />
        {campaign?.startAt && (
          <DatePicker
            className="w-30 rounded"
            defaultValue={moment(campaign?.startAt)}
            format="YYYY/MM/DD HH:mm:ss"
            placeholder={t('gift.start_time')}
            showTime={{ format: 'HH:mm' }}
            onChange={onChangeStartAt}
          />
        )}

        {!campaign?.startAt && (
          <DatePicker
            className="w-30 rounded"
            format="YYYY/MM/DD HH:mm:ss"
            placeholder={t('gift.start_time')}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={onChangeStartAt}
          />
        )}

        <span>～</span>

        {campaign?.endAt && (
          <DatePicker
            className="w-30 rounded"
            defaultValue={moment(campaign?.endAt)}
            format="YYYY/MM/DD HH:mm:ss"
            placeholder={t('gift.end_time')}
            showTime={{ format: 'HH:mm' }}
            onChange={onChangeEndAt}
          />
        )}

        {!campaign?.endAt && (
          <DatePicker
            className="w-30 rounded"
            format="YYYY/MM/DD HH:mm:ss"
            placeholder={t('gift.end_time')}
            showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
            onChange={onChangeEndAt}
          />
        )}
      </div>

      <div className="flex gap-14 h-8">
        <div className="flex items-center gap-3 ml-40">
          <span>{t('regular_campagin')}</span>
          <Switch
            checked={openRegular}
            size="small"
            onChange={(checked) => {
              onChangeParameter({ historyRetention: '' });
              setOpenRegular(checked);
            }}
          />
        </div>
        {openRegular && (
          <div className="gap-3 flex items-center">
            <span>{t('gift.time_interval')}</span>
            <Input
              className="w-16"
              value={campaign?.historyRetention}
              onChange={(e) =>
                onChangeParameter({ historyRetention: e.target.value })
              }
            />
            <span>{t('gift.regular_desc')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
