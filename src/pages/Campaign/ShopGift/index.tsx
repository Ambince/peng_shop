import { getAllCampaigns, initCondition } from '@/api/gift/commonGampaign';
import { GiftTitile } from '@/components/Gift/GiftTitle';
import { setCurrentGiftType, setFlushPageType } from '@/store/giftSlice';
import {
  CampaignInfo,
  CampaignType,
  GiftCampaignType,
  GiftPurpose,
} from '@/types/gift';
import { Table, notification } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import Column from 'antd/lib/table/Column';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Condition } from '../NewGiftCampaign/Tables/Codition';
import { GiftColumn } from '../NewGiftCampaign/Tables/GiftColumn';
import { Header } from '../NewGiftCampaign/Tables/Header';

const fields = [
  'id',
  'shop_content',
  'user',
  'duration',
  'status',
  'operation',
];
export function ShopGiftCampaign(): JSX.Element {
  const { t } = useTranslation();
  const { flushPageType, appId } = useSelector((store) => store.gift);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const columns = fields.map((dataIndex) => ({
    title: t(`gift.${dataIndex}`),
    dataIndex,
  }));
  const [condition, setCondition] = useState<{ [key: string]: any }>(
    initCondition,
  );
  const [dataSource, setDataSource] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  const showNoticeInfo = (type, message, description) => {
    notification[type]({ message, description });
  };

  const initData = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    const copyCondition = JSON.parse(JSON.stringify(condition));
    delete copyCondition.totalCount;
    delete copyCondition.flush;
    copyCondition.appId = appId;
    copyCondition.type = CampaignType.SHOP;
    Object.keys(copyCondition).forEach((key) => {
      const value = copyCondition[key];
      if (!value && value !== 0) delete copyCondition[key];
    });
    const { info, page, error } = await getAllCampaigns(copyCondition);
    if (!info || error) {
      showNoticeInfo('error', 'Server Error', error);
      setLoading(false);
      return;
    }

    setDataSource(
      info.map((item: CampaignInfo) => ({ ...item, key: item.campaign.id })),
    );
    setCondition((pre) => ({
      ...pre,
      totalCount: page.totalCount,
      pageIndex: page.pageIndex,
      flush: false,
    }));
    dispatch(setFlushPageType({ type: null }));
    setLoading(false);
  }, [condition]);

  useEffect(() => {
    if (condition.flush) initData();
    dispatch(setCurrentGiftType({ type: GiftCampaignType.SHOP }));
  }, [condition]);

  useEffect(() => {
    if (flushPageType === GiftCampaignType.SHOP) {
      setCondition((pre) => ({ ...pre, flush: true }));
    }
  }, [flushPageType]);

  useEffect(() => {
    setCondition((pre) => ({ ...pre, flush: true }));
  }, [appId]);

  const onChangePage = (page: { current: number; pageSize: number }) => {
    setCondition((pre) => ({
      ...pre,
      pageIndex: page.current - 1,
      flush: true,
    }));
  };

  const changeConditionCallback = (curCondition) => {
    setCondition((pre) => ({
      ...pre,
      ...curCondition,
      flush: true,
    }));
  };

  const getWidth = (dataIndex) => {
    if (dataIndex === 'content') return 200;
    if (dataIndex === 'name') return 240;
    if (dataIndex === 'duration') return 320;
    if (dataIndex === 'operation') return 180;
    if (dataIndex === 'type') return 120;
    if (dataIndex === 'user') return 120;
    return 100;
  };

  return (
    <div className="bg-@main-background w-full  flex-col gap-8 flex">
      <GiftTitile filter={GiftPurpose.SHOP} />

      {/* TABLE */}
      <div className="bg-white ml-6 px-4 rounded-md " style={{ zIndex: 1 }}>
        <div className="py-4">
          <span className="text-@textheading text-lg font-bold">
            Shop Campaign List
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Condition
            callback={(curCondition) => changeConditionCallback(curCondition)}
            campaignType={GiftCampaignType.SHOP}
          />

          {selectedRowKeys.length > 0 && (
            <Header
              callback={() => setCondition((pre) => ({ ...pre, flush: true }))}
              ids={selectedRowKeys.map((id) => Number(id))}
              showDelete
            />
          )}
          <Table
            dataSource={dataSource}
            loading={loading}
            pagination={{
              total: condition.totalCount,
              defaultPageSize: condition.itemsPerPage,
            }}
            rowSelection={rowSelection}
            scroll={{ y: '60vh' }}
            onChange={(page: any) => onChangePage(page)}
          >
            {columns.map(
              (column: { title: string; dataIndex: string }, index) => {
                return (
                  <Column
                    key={`table_column_${index}`}
                    dataIndex={column.dataIndex}
                    ellipsis
                    render={(_: any, record: CampaignInfo) => {
                      return (
                        <GiftColumn
                          key={`gift_column_${record.campaign.id}`}
                          column={column}
                          record={record}
                          refreshCallback={() =>
                            setCondition((pre) => ({ ...pre, flush: true }))
                          }
                          type={GiftCampaignType.SHOP}
                        />
                      );
                    }}
                    title={column.title}
                    width={getWidth(column.dataIndex)}
                  />
                );
              },
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
