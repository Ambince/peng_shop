import { initCondition } from '@/api/gift/commonGampaign';
import { fetchLevelups } from '@/api/gift/levelup';
import { setFlushPageType } from '@/store/giftSlice';
import { CampaignInfo, GiftCampaignType } from '@/types/gift';
import { CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Table, notification } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import Column from 'antd/lib/table/Column';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { Condition } from './Codition';
import { GiftColumn } from './GiftColumn';
import { Header } from './Header';
import { LevelupCalendar } from './LevelupCalendar';

const fields = ['id', 'level', 'content', 'time', 'status', 'operation'];

export function LevelupTable({ type }: { type: string }): JSX.Element {
  const { t } = useTranslation();
  const { flushPageType, appId } = useSelector((store) => store.gift);
  const dispatch = useDispatch();

  const columns = fields.map((dataIndex) => ({
    title: t(`gift.${dataIndex}`),
    dataIndex,
  }));
  const [tableType, setTableType] = useState('list');
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

  const initData = async () => {
    if (!appId) return;
    const copyCondition = JSON.parse(JSON.stringify(condition));
    delete copyCondition.totalCount;
    copyCondition.appId = appId;
    Object.keys(copyCondition).forEach((key) => {
      const value = copyCondition[key];
      if (!value && value !== 0) delete copyCondition[key];
    });
    const { info, page, error } = await fetchLevelups(copyCondition);
    if (!info || error) {
      showNoticeInfo('error', 'Server Error', error);
      return;
    }

    const currentDataSource = info.map((item: CampaignInfo) => ({
      ...item,
      key: item.campaign.id,
    }));

    setDataSource(currentDataSource);
    setCondition((pre) => ({
      ...pre,
      totalCount: page.totalCount,
      pageIndex: page.pageIndex,
      flush: false,
    }));
    dispatch(setFlushPageType({ type: null }));
  };

  useEffect(() => {
    if (condition.flush) initData();
  }, [condition]);

  useEffect(() => {
    setCondition((pre) => ({ ...pre, flush: true }));
  }, [appId]);

  useEffect(() => {
    if (flushPageType === GiftCampaignType.LEVEL_UP)
      setCondition((pre) => ({ ...pre, flush: true }));
  }, [flushPageType]);

  useEffect(() => {
    if (tableType === 'card') setCondition(initCondition);
  }, [tableType]);

  const onChangePage = (page: { current: number; pageSize: number }) => {
    setCondition((pre) => ({
      ...pre,
      pageIndex: page.current - 1,
      flush: true,
    }));
  };

  const changeConditionCallback = (curCondition) => {
    let flush = true;
    if (tableType === 'card') flush = false;
    setCondition((pre) => ({
      ...pre,
      ...curCondition,
      flush,
    }));
  };

  const getWidth = (dataIndex) => {
    if (dataIndex === 'content') return 200;
    if (dataIndex === 'time') return 180;
    if (dataIndex === 'operation') return 180;
    if (dataIndex === 'trigger') return 140;
    if (dataIndex === 'user') return 120;
    return 100;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Condition
          callback={(curCondition) => changeConditionCallback(curCondition)}
          campaignType={type}
          isShowTime={false}
        />
        <div className="flex items-center gap-2">
          <div
            className="border hover:cursor-pointer hover:opacity-70 border-gray-200 h-8 w-8 flex justify-center items-center rounded-md"
            onClick={() => setTableType('card')}
          >
            <CalendarOutlined />
          </div>
          <div
            className="border hover:cursor-pointer hover:opacity-70 border-gray-200 h-8 w-8 flex justify-center items-center rounded-md"
            onClick={() => setTableType('list')}
          >
            <UnorderedListOutlined />
          </div>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <Header
          callback={() => setCondition((pre) => ({ ...pre, flush: true }))}
          ids={selectedRowKeys.map((id) => Number(id))}
        />
      )}
      {tableType === 'list' && (
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
          {columns.map(
            (column: { title: string; dataIndex: string }, index) => {
              return (
                <Column
                  key={`table_column_${index}`}
                  dataIndex={column.dataIndex}
                  render={(_: any, record: CampaignInfo) => {
                    return (
                      <GiftColumn
                        key={`gift_column_${record.campaign.id}`}
                        column={column}
                        record={record}
                        refreshCallback={() =>
                          setCondition((pre) => ({ ...pre, flush: true }))
                        }
                        type={GiftCampaignType.LEVEL_UP}
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
      )}

      {tableType === 'card' && dataSource && condition && (
        <LevelupCalendar condition={condition} dataSource={dataSource} />
      )}
    </div>
  );
}
