import { initCondition } from '@/api/super/common_admin';
import { fetchVersions } from '@/api/super/version_admin';
import { VersionModal } from '@/components/Gift/modal/VersionModal';
import { useModal } from '@/pages/modal/ModalProvider';
import { SuperContent } from '@/types/super_admin';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, notification } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { VersionColunm } from './common/VersionColunm';

const fields = ['id', 'appVersion', 'version', 'createdAt', 'updatedAt'];
export function VersionPage(): JSX.Element {
  const { t } = useTranslation();
  const { showModal } = useModal();

  const columns = fields.map((dataIndex) => ({ title: dataIndex, dataIndex }));
  const [condition, setCondition] = useState<{ [key: string]: any }>({
    ...initCondition,
  });
  const [dataSource, setDataSource] = useState<any>(null);

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
    const { info, page, error } = await fetchVersions(copyCondition);
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

  const onChangePage = (page: { current: number; pageSize: number }) => {
    setCondition((pre) => ({
      ...pre,
      pageIndex: page.current - 1,
      flush: true,
    }));
  };

  const onFlush = () => {
    setCondition((pre) => ({
      ...pre,
      flush: true,
    }));
  };

  useEffect(() => {
    if (condition.flush) initData();
  }, [condition]);

  return (
    <div className="bg-@main-background w-full  flex-col gap-8 flex">
      <div className="flex pt-8 gap-6 items-center">
        <span className="text-2xl font-bold pl-7">Super Versions</span>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={async () => {
            showModal(<VersionModal success={() => onFlush()} />);
          }}
        >
          {t('create')}
        </Button>
      </div>

      <div className="bg-white ml-6 px-4 rounded-md ">
        <div className="text-@textheading text-lg font-bold py-4 justify-between w-full flex">
          <span> Version List</span>
        </div>

        <div className="flex flex-col gap-2">
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
                    render={(_: any, record: SuperContent) => {
                      return (
                        <VersionColunm
                          key={`content_column_${record.id}`}
                          column={column}
                          record={record}
                        />
                      );
                    }}
                    title={column.title}
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
