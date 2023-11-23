import { postGetCampaignToken } from '@/api';
import {
  deleteCampaignById,
  updateCampaignStatus,
} from '@/api/gift/commonGampaign';
import { getAuthList } from '@/common/auxin/AuxinCommon';
import { NoticeModal } from '@/components/Gift/modal/NoticeModal';
import { useModal } from '@/pages/modal/ModalProvider';
import { ABTest, copyCampaign, eidtCampaign } from '@/store/giftSlice';
import { CampaignInfo, CampaignStatus, GiftCampaignType } from '@/types/gift';
import { timeFormat } from '@/utils';
import {
  CopyOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, message, Popover, Statistic, Switch, Tag } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getTypeTagColor } from '../../SuperAdmin/common/SuperColumn';
import { GiftDetail } from '../GiftDetail';

interface ColumnProps {
  title: string;
  dataIndex: string;
}

export function GiftColumn({
  type,
  column,
  record,
  refreshCallback,
}: {
  type: GiftCampaignType & any;
  column: ColumnProps;
  record: CampaignInfo;
  refreshCallback: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showModal, hideModal } = useModal();
  const { appId } = useSelector((store) => store.gift);
  const [shopUrl, setShopUrl] = useState<string>();

  const getTriggers = () => {
    const triggers: string[] = [];
    record.groups.forEach((group) =>
      group.ruleGroups.forEach((ruleGroup) =>
        ruleGroup.ruleList.forEach((rule) => triggers.push(rule.conditionName)),
      ),
    );
    return triggers;
  };

  const getLevelRangeStr = () => {
    const param =
      record?.groups[0]?.ruleGroups[0]?.ruleList[0]?.parameters ?? {};
    return `${param?.level ?? ''} - ${param?.maxLevel ?? ''}`;
  };

  const getDurationStr = () => {
    const start = timeFormat(record.campaign.startAt);
    const endTime = record.campaign.endAt;
    let end = '';
    if (endTime) end = timeFormat(endTime);
    return `${start ?? ''} - ${end ?? ''}`;
  };

  const getAvailableStr = () => {
    if (record.campaign.startAt > Date.now())
      return [t('gift.going'), 'text-@tag-text-3', 'bg-@tag-bg-3'];
    return [
      t(`common.t_${record.campaign.status}`),
      'text-@tag-text-2',
      'bg-@tag-bg-2',
    ];
  };

  const onOpenShopSite = () => {
    const website = `${import.meta.env.VITE_GIFT_URL}marketplace/${appId}`;
    window.open(website, '_blank');
  };

  const onEditCampaign = () => {
    dispatch(eidtCampaign({ record, type }));
  };

  const onCopyCampaign = () => {
    dispatch(copyCampaign({ record, type }));
  };

  const onDelete = async () => {
    await deleteCampaignById(record?.campaign?.id);
    refreshCallback();
    hideModal();
  };

  const onChangeStatus = async (checked) => {
    await updateCampaignStatus(record?.campaign?.id, checked);
    refreshCallback();
    hideModal();
  };

  const isShowTriggerMulti = (index) => {
    const purpose: any = record.campaign.purpose;
    if (!purpose) return true;

    if (Number(purpose) === ABTest.GIFT) {
      if (index) return false;
    }

    if (Number(purpose) === ABTest.TRIGGER) {
      if (index) return true;
    }

    return true;
  };

  const isShowGiftMulti = (index) => {
    const purpose: any = record.campaign.purpose;
    if (!purpose) return true;

    if (Number(purpose) === ABTest.GIFT) {
      if (index) return true;
    }

    if (Number(purpose) === ABTest.TRIGGER) {
      if (index) return false;
    }

    return true;
  };

  const isShowDeepUser = () => {
    if (type === GiftCampaignType.ALL) return true;
    if (type === GiftCampaignType.SHOP) return true;

    return false;
  };

  const showAdminStatus = () => {
    const auth = getAuthList();
    if (auth.shop_gift_m) return true;
    return false;
  };

  return (
    <>
      {column.dataIndex === 'id' && <>{record.campaign.id}</>}
      {column.dataIndex === 'level' && <span>{getLevelRangeStr()}</span>}

      {column.dataIndex === 'duration' && <span>{getDurationStr()}</span>}

      {column.dataIndex === 'content' && (
        <div className="flex flex-col gap-2 ">
          {record.groups.map((group, index) => {
            return (
              <div key={`table_content_${index}`}>
                {isShowGiftMulti(index) && (
                  <div className="flex items-center gap-1">
                    <div
                      className="rounded-full border border-gray-500 w-4 h-4 flex justify-center items-center text-xs"
                      style={{ border: 'solid' }}
                    >
                      {index + 1}
                    </div>
                    <Popover
                      content={<GiftDetail gift={group.giftInfo} />}
                      placement="bottom"
                    >
                      <span className="text-@MainGreen w-20 truncate">
                        {group.giftInfo?.displayId ?? t('common.no_exist')}
                      </span>
                    </Popover>

                    <div className="flex-1">
                      <Statistic
                        suffix="¥"
                        value={group.giftInfo?.localPrice}
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {column.dataIndex === 'shop_content' && (
        <span
          className="hover:opacity-70 hover:cursor-pointer text-@MainGreen"
          onClick={() => onOpenShopSite()}
        >
          {t('shop.url')}
        </span>
      )}

      {column.dataIndex === 'keyword' && (
        <div className="flex flex-col gap-2 min-w-[140px]">
          {record.groups.map((group, index) => {
            return (
              <span key={`keyword_${index}`}>
                {group.ruleGroups[0]?.ruleList[0]?.parameters?.expression}
              </span>
            );
          })}
        </div>
      )}

      {column.dataIndex === 'trigger' && (
        <div className="flex flex-col gap-2 ">
          {getTriggers().map((trigger, index) => {
            return (
              <div key={`trigger_${trigger}_${index}`}>
                {isShowTriggerMulti(index) && (
                  <div className="flex items-center gap-1 ">
                    <div
                      className=" rounded-full border border-gray-500 w-4 h-4 flex justify-center items-center "
                      style={{ border: 'solid 1px' }}
                    >
                      <span> {index + 1}</span>
                    </div>
                    <span>{t(trigger)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {column.dataIndex === 'user' && type === GiftCampaignType.NORMAL && (
        <Tag className="text-xs rounded-2xl">
          {record.campaign.segmentName
            ? t(`${record.campaign.segmentName}`)
            : t('common.all')}
        </Tag>
      )}

      {column.dataIndex === 'user' && isShowDeepUser() && (
        <Tag className="text-xs rounded-2xl">
          {record.campaign?.segmentConfig?.segmentName
            ? t(`${record.campaign.segmentConfig.segmentName}`)
            : t('common.all')}
        </Tag>
      )}

      {column.dataIndex === 'type' && (
        <Tag
          className="text-xs rounded-2xl"
          color={getTypeTagColor(record.campaign.type)[1]}
          style={{
            color: getTypeTagColor(record.campaign.type)[6],
            borderColor: getTypeTagColor(record.campaign.type)[3],
          }}
        >
          {record.campaign.type}
        </Tag>
      )}

      {column.dataIndex === 'name' && (
        <Popover
          content={
            <div className="p-3  flex break-words rounded bg-@hover&disable">
              {record.campaign.name}
            </div>
          }
        >
          <div className="text-xs truncate w-[200px]">
            {record.campaign.name}
          </div>
        </Popover>
      )}

      {column.dataIndex === 'time' && (
        <div className="flex flex-col gap-1">
          <span>{timeFormat(record.campaign.startAt)}</span>

          {record.campaign?.historyRetention && (
            <span>
              Regular: {record.campaign.historyRetention}{' '}
              {record.campaign.historyRetention > 1 ? 'hours' : 'hour'}
            </span>
          )}
        </div>
      )}
      {column.dataIndex === 'status' && (
        <>
          {record.campaign.status === CampaignStatus.AVAILABLE ? (
            <div
              className={`flex justify-center items-center px-[2px] rounded-full max-w-[70px] ${
                getAvailableStr()[2]
              } `}
            >
              <span className={`text-xs ${getAvailableStr()[1]} p-1`}>
                {getAvailableStr()[0]}
              </span>
            </div>
          ) : (
            <div className="bg-@hover&disable flex justify-center items-center px-[2px] rounded-full max-w-[70px]">
              <span className="text-xs text-@textlable py-1 p-1">
                {t(`common.${record.campaign.status}`)}
              </span>
            </div>
          )}
        </>
      )}
      {column.dataIndex === 'operation' && (
        <div className="flex flex-row gap-2 items-center">
          {showAdminStatus() && (
            <Switch
              checked={record.campaign.status !== 'disabled'}
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
          )}
          {record.campaign.type.startsWith('external') && (
            <Button
              size="small"
              type="primary"
              onClick={async (): Promise<void> => {
                const data = await postGetCampaignToken(record.campaign.id);
                if (data.info) {
                  const code = encodeURIComponent(data.info);
                  navigator.clipboard.writeText(code);
                  message.success(`Copy Succeed, Code: ${code}`);
                }
              }}
            >
              <DeploymentUnitOutlined />
              {t('common_code')}
            </Button>
          )}
          <Button
            className="border-@MainGreen text-@MainGreen"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditCampaign()}
          />

          {type !== GiftCampaignType.ALL && (
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => onCopyCampaign()}
            />
          )}

          <Button
            icon={<DeleteOutlined />}
            size="small"
            onClick={async () => {
              showModal(
                <NoticeModal
                  content={t('gift.delete_status_content')}
                  isDanger
                  okDesc={t('delete')}
                  success={() => onDelete()}
                  title={t('gift.delete_status_title')}
                />,
              );
            }}
          />
        </div>
      )}
    </>
  );
}
