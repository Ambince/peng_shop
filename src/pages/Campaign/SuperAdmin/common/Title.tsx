import { createContent, updateContent } from '@/api/super/contents';
import { setEditContent } from '@/store/giftSlice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Image, Popover, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DrawerContent } from './DrawerContent';

const checkFields = ['name', 'configs', 'userConfigs', 'type'];

export function Title({ callback }): JSX.Element {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { isEdit } = useSelector((store) => store.gift);
  const dispatch = useDispatch();

  const showNoticeInfo = (type, message, description) => {
    notification[type]({ message, description });
  };

  const onCloseDrawer = () => {
    setOpen(false);
    dispatch(setEditContent({ isEdit: false }));
    callback();
  };

  const isJSONString = (str: string): boolean => {
    try {
      const parsedJSON = JSON.parse(str);
      console.info(`[parsedJSON]`, parsedJSON);
      if (typeof parsedJSON !== 'object' || parsedJSON === null) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  const onCreateOrUpdateContent = async (content) => {
    console.info(`[onCreateOrUpdateContent]`, content);

    for (const filed of checkFields) {
      const value = content[filed];
      if (!value) {
        showNoticeInfo('error', filed, `${filed} can not be null`);
        return;
      }
      if (filed === 'configs' || filed === 'userConfigs') {
        if (!isJSONString(value)) {
          showNoticeInfo('error', filed, `${filed} must be json`);
          return;
        }
      }
    }
    if (isEdit) await updateContent(content);
    else await createContent(content);
    onCloseDrawer();
  };

  useEffect(() => {
    if (isEdit) setOpen(true);
  }, [isEdit]);

  return (
    <div className="flex pt-8 gap-6 items-center">
      <span className="text-2xl font-bold pl-7">Super Contents</span>
      <Button
        className="w-36 rounded-lg bg-@MainGreen text-white"
        icon={<PlusOutlined />}
        onClick={() => setOpen(!open)}
      >
        New Contents
      </Button>

      <Drawer
        bodyStyle={{ padding: 0 }}
        closable={false}
        destroyOnClose
        maskClosable
        open={open}
        placement="right"
        size="large"
        width={800}
        zIndex={900}
        onClose={() => onCloseDrawer()}
      >
        <DrawerContent
          confrim={(content) => onCreateOrUpdateContent(content)}
          dismiss={() => onCloseDrawer()}
        />
      </Drawer>
    </div>
  );
}
