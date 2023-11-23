import { getContentTypes } from '@/api/gift/campaign';
import { initCondition } from '@/api/super/common_admin';
import { fetchContens } from '@/api/super/contents';
import { SuperContent } from '@/types/super_admin';
import { Input, Select, Table, notification } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SuperColumn } from './common/SuperColumn';
import { Title } from './common/Title';

const { Search } = Input;

const fields = ['id', 'name', 'type', 'configs', 'userConfigs', 'operation'];
export function SuperContents({
  isModal = false,
  callback = (record) => {},
}): JSX.Element {
  const { t } = useTranslation();
  const columns = fields.map((dataIndex) => ({
    title: t(`gift.${dataIndex}`),
    dataIndex,
  }));
  const [condition, setCondition] = useState<{ [key: string]: any }>({
    ...initCondition,
  });
  const [dataSource, setDataSource] = useState<any>(null);
  const [types, setTypes] = useState<any>([]);

  const showNoticeInfo = (type, message, description) => {
    notification[type]({ message, description });
  };

  const initData = useCallback(async () => {
    const copyCondition = JSON.parse(JSON.stringify(condition));
    delete copyCondition.totalCount;
    delete copyCondition.flush;
    Object.keys(copyCondition).forEach((key) => {
      const value = copyCondition[key];
      if (!value && value !== 0) delete copyCondition[key];
    });
    const { info, page, error } = await fetchContens(copyCondition);
    if (!info || error) {
      showNoticeInfo('error', 'Server Error', error);
      return;
    }

    setDataSource(info.map((item) => ({ ...item, key: item.id })));
    setCondition((pre) => ({
      ...pre,
      totalCount: page.totalCount,
      pageIndex: page.pageIndex,
      flush: false,
    }));
  }, [condition]);

  const initPreData = async () => {
    const { info } = await getContentTypes();
    const options = info.map((value) => ({ label: value, value }));
    options.unshift({ label: t('common.all_type'), value: '' as any });
    setTypes(options);
  };

  useEffect(() => {
    initPreData();
  }, []);

  useEffect(() => {
    if (condition.flush) initData();
  }, [condition]);

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
    if (dataIndex === 'userConfigs') return 200;
    if (dataIndex === 'name') return 180;
    if (dataIndex === 'duration') return 180;
    if (dataIndex === 'operation') return 180;
    if (dataIndex === 'type') return 120;
    if (dataIndex === 'configs') return 240;
    return 100;
  };

  return (
    <div className="bg-@main-background w-full  flex-col gap-8 flex">
      {!isModal && (
        <Title
          callback={() => {
            setCondition((pre) => ({ ...pre, flush: true }));
          }}
        />
      )}

      <div className="bg-white ml-6 px-4 rounded-md ">
        <div className="text-@textheading text-lg font-bold py-4">
          Contents List
        </div>

        <div className="flex flex-col gap-2">
          {/* Condition */}
          <div className="flex gap-2 items-center">
            <Search
              className="w-40 rounded-lg"
              placeholder="ID"
              onChange={(e) =>
                changeConditionCallback({ contentId: e.target.value })
              }
              onSearch={(value) => {
                changeConditionCallback({ contentId: value });
              }}
            />
            {types.length > 0 && (
              <Select
                className="w-48"
                defaultValue={`${t('common.all_type')}`}
                options={types}
                value={condition.contentType}
                onChange={(contentType) =>
                  changeConditionCallback({ contentType })
                }
              />
            )}
          </div>

          <Table
            dataSource={dataSource}
            pagination={{
              total: condition.totalCount,
              defaultPageSize: condition.itemsPerPage,
            }}
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
                    render={(_: any, record: SuperContent) => {
                      return (
                        <SuperColumn
                          key={`content_column_${record.id}`}
                          addCallabck={() => callback(record)}
                          column={column}
                          isModal={isModal}
                          record={record}
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
