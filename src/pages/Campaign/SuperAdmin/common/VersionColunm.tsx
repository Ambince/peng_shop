import { timeFormat } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function VersionColunm({ column, record }): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columnItem = () => {
    if (column.dataIndex === 'createdAt') {
      return <span> {timeFormat(record[column.dataIndex])}</span>;
    }

    if (column.dataIndex === 'updatedAt') {
      return <span> {timeFormat(record[column.dataIndex])}</span>;
    }

    return <div className="text-xs truncate">{record[column.dataIndex]}</div>;
  };

  return <>{columnItem()}</>;
}
