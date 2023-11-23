import { createNewToken, getCampaignTypes } from '@/api/gift/campaign';
import { SelectProps, getGames } from '@/api/gift/commonGampaign';
import { setCurrentGiftType, setIsCreate } from '@/store/giftSlice';
import { GiftCampaignType } from '@/types/gift';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Space, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

interface Option {
  label: string;
  value: string;
}

const { Search } = Input;
const { RangePicker } = DatePicker;
export function Condition({
  callback,
  campaignType,
  isShowTime = true,
}: {
  callback: (condition: any) => void;
  campaignType: any;
  isShowTime?: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const [levelStart, setLevelStart] = useState('');
  const [levelEnd, setLevelEnd] = useState('');

  const dispatch = useDispatch();
  const { appId } = useSelector((store) => store.gift);
  const [campainTypes, setCampainTypes] = useState<Option[]>([]);
  const [games, setGames] = useState<Option[]>([]);

  const statusOptions = [
    { label: t('common.all'), value: '' },
    { label: t('common.available'), value: 'available' },
    { label: t('common.disabled'), value: 'disabled' },
  ];

  const initData = async () => {
    if (campaignType === GiftCampaignType.ALL) {
      const res: any = await getGames();
      const games = res.info;
      const ids: SelectProps[] = games.map((game) => ({
        label: game.appId,
        value: game.appId,
      }));
      ids.unshift({ label: 'all', value: '' });
      setGames(ids);
    }
    const { info } = await getCampaignTypes();
    const typeOptions = info.map((value) => ({ label: value, value }));
    typeOptions.unshift({ label: t('common.all_type'), value: '' as any });
    setCampainTypes(typeOptions);
  };

  const onSearch = (campaignId: string): any => {
    callback({ campaignId });
  };

  const onSearchRange = (times: any) => {
    if (times.length <= 1) return;
    if (!times[0] || !times[1]) return;
    const creationEndAt = new Date(times[1].format()).getTime();
    const creationStartAt = new Date(times[0].format()).getTime();
    callback({ creationEndAt, creationStartAt });
  };

  const onTimeRangeChange = (times) => {
    if (!times) callback({ creationEndAt: '', creationStartAt: '' });
  };

  const onSearchLevelRange = (opt: { min?: string; max?: string }) => {
    setLevelStart(opt.min ?? '');
    setLevelEnd(opt.max ?? '');
  };

  const onInputChange = (e) => {
    if (!e.target.value) callback({ campaignId: '' });
  };

  const onCreateCampaign = () => {
    dispatch(setCurrentGiftType({ type: campaignType }));
    dispatch(setIsCreate({ isCreate: true }));
  };

  useEffect(() => {
    callback({ levelEnd, levelStart });
  }, [levelEnd, levelStart]);

  useEffect(() => {
    initData();
  }, []);

  const getShowCreateButton = () => {
    if (campaignType === GiftCampaignType.ALL) return false;
    if (campaignType === GiftCampaignType.SHOP) return false;
    return true;
  };

  const getShowCreateToken = () => {
    if (campaignType === GiftCampaignType.SHOP) return true;
    return false;
  };

  const onCreateToken = async () => {
    const durationSec = 60 * 60;
    const lifecycleId = 'test';
    const { error } = await createNewToken({ appId, durationSec, lifecycleId });
    if (error) {
      notification.success({ message: 'Token Error', description: error });
      return;
    }
    notification.success({
      message: 'Token',
      description: 'generate successfully',
    });
    const game_site = `${import.meta.env.VITE_GAME_SITE}/${appId}`;
    window.open(game_site);
  };

  return (
    <div className="flex gap-2 items-center">
      <Search
        className="w-40 rounded-lg"
        placeholder="ID"
        onChange={(id) => onInputChange(id)}
        onSearch={(id) => onSearch(id)}
      />

      {campaignType === GiftCampaignType.LEVEL_UP && (
        <Space>
          <Input
            className="w-32"
            placeholder={t('min_level')}
            type="number"
            value={levelStart}
            onChange={(e) =>
              onSearchLevelRange({ min: e.target.value, max: levelEnd })
            }
          />
          <span>～</span>
          <Input
            className="w-32"
            placeholder={t('max_level')}
            type="number"
            value={levelEnd}
            onChange={(e) =>
              onSearchLevelRange({ max: e.target.value, min: levelStart })
            }
          />
        </Space>
      )}
      {isShowTime && (
        <RangePicker
          className="w-30"
          format="YYYY-MM-DD HH:mm"
          placeholder={[t('gift.start_time'), t('gift.end_time')]}
          showTime={{ format: 'HH:mm' }}
          onChange={onTimeRangeChange}
          onOk={onSearchRange}
        />
      )}

      {/* <Select
        className="w-48"
        defaultValue={`${t('common.all_user')}`}
        options={users}
        onChange={(segmentName) => callback({ segmentName })}
      /> */}

      <Select
        className="w-30"
        defaultValue={`${t('common.all_status')}`}
        options={statusOptions}
        onChange={(status) => callback({ status })}
      />

      {campaignType === GiftCampaignType.ALL && (
        <Select
          className="w-48"
          defaultValue={`${t('common.all_type')}`}
          options={campainTypes}
          onChange={(type) => callback({ type })}
        />
      )}

      {campaignType === GiftCampaignType.ALL && (
        <Select
          className="w-48"
          defaultValue="all"
          options={games}
          placeholder="appid"
          onChange={(appId) => callback({ appId })}
        />
      )}

      {getShowCreateButton() && (
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => onCreateCampaign()}
        >
          {t('create')}
        </Button>
      )}
    </div>
  );
}
