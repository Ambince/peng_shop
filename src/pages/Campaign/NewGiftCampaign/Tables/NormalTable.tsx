import { initCondition } from '@/api/gift/commonGampaign';
import { fetchNormalCampaigns } from '@/api/gift/normal';
import { setFlushPageType } from '@/store/giftSlice';
import { CampaignInfo, GiftCampaignType } from '@/types/gift';
import { Table, notification } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import Column from 'antd/lib/table/Column';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Condition } from './Codition';
import { GiftColumn } from './GiftColumn';
import { Header } from './Header';

const fields = [
  'id',
  'content',
  'trigger',
  'user',
  'time',
  'status',
  'operation',
];

export function NormalTable({ type }: { type: string }): JSX.Element {
  const { flushPageType, appId } = useSelector((store) => store.gift);
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
    const copyCondition = JSON.parse(JSON.stringify(condition));
    delete copyCondition.totalCount;
    delete copyCondition.flush;
    copyCondition.appId = appId;
    Object.keys(copyCondition).forEach((key) => {
      const value = copyCondition[key];
      if (!value && value !== 0) delete copyCondition[key];
    });
    const { info, page, error } = await fetchNormalCampaigns(copyCondition);
    if (!info || error) {
      showNoticeInfo('error', 'Server Error', error);
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
  }, [condition]);

  useEffect(() => {
    if (condition.flush) initData();
  }, [condition]);

  useEffect(() => {
    if (flushPageType === GiftCampaignType.NORMAL)
      setCondition((pre) => ({ ...pre, flush: true }));
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
    if (dataIndex === 'time') return 140;
    if (dataIndex === 'operation') return 180;
    if (dataIndex === 'trigger') return 140;
    if (dataIndex === 'user') return 120;
    return 100;
  };

  return (
    <div className="flex flex-col gap-2">
      <Condition
        callback={(curCondition) => changeConditionCallback(curCondition)}
        campaignType={type}
      />
      {selectedRowKeys.length > 0 && (
        <Header
          callback={() => setCondition((pre) => ({ ...pre, flush: true }))}
          ids={selectedRowKeys.map((id) => Number(id))}
        />
      )}
      <Table
        dataSource={dataSource}
        pagination={{
          total: condition.totalCount,
          defaultPageSize: condition.itemsPerPage,
        }}
        rowSelection={rowSelection}
        scroll={{ y: '60vh' }}
        onChange={(page: any) => onChangePage(page)}
      >
        {columns.map((column: { title: string; dataIndex: string }, index) => {
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
                    type={GiftCampaignType.NORMAL}
                  />
                );
              }}
              title={column.title}
              width={getWidth(column.dataIndex)}
            />
          );
        })}
      </Table>
    </div>
  );
}
