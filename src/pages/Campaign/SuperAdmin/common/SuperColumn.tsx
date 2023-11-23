import { setEditContent } from '@/store/giftSlice';
import { SuperContent } from '@/types/super_admin';
import {
  cyan,
  gold,
  gray,
  lime,
  magenta,
  purple,
  red,
} from '@ant-design/colors';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Popover, Tag } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export const colors: string[][] = [magenta, gold, cyan, purple, red, lime];

export const getTypeTagColor = (type) => {
  if (!type) return gray;

  const length = type.length;
  return colors[length % colors.length];
};

interface ColumnProps {
  title: string;
  dataIndex: string;
}
const maxWidth = { name: 200, userConfigs: 300, configs: 300 };
export function SuperColumn({
  column,
  record,
  isModal,
  addCallabck,
}: {
  isModal?: boolean;
  column: ColumnProps;
  record: SuperContent;
  addCallabck?: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onEditContent = () => {
    dispatch(setEditContent({ isEdit: true, content: record }));
  };

  const columnItem = () => {
    if (column.dataIndex === 'type') {
      return (
        <Tag
          className="text-xs rounded-2xl"
          color={getTypeTagColor(record[column.dataIndex])[1]}
          style={{
            color: getTypeTagColor(record[column.dataIndex])[6],
            borderColor: getTypeTagColor(record[column.dataIndex])[3],
          }}
        >
          {record[column.dataIndex]}
        </Tag>
      );
    }

    if (column.dataIndex === 'operation') {
      return (
        <>
          {!isModal ? (
            <Button
              className="border-@MainGreen text-@MainGreen"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditContent()}
            >
              Edit
            </Button>
          ) : (
            <Button
              icon={<PlusCircleFilled />}
              size="small"
              type="primary"
              onClick={() => {
                if (addCallabck) addCallabck();
              }}
            >
              ADD
            </Button>
          )}
        </>
      );
    }

    return (
      <Popover
        content={
          <div className="p-3  flex break-words rounded bg-@hover&disable">
            {record[column.dataIndex]}
          </div>
        }
      >
        <div className="text-xs truncate">{record[column.dataIndex]}</div>
      </Popover>
    );
  };

  return <>{columnItem()}</>;
}
