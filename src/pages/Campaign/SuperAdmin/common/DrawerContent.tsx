import { getContentTypes } from '@/api/gift/campaign';
import { CategoryTitle } from '@/components/Gift/CategoryTitle';
import { IconTile } from '@/components/Gift/IconTitle';
import { SuperContent } from '@/types/super_admin';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
export function DrawerContent({ dismiss, confrim }) {
  const [content, setContent] = useState<SuperContent>();
  const { isEdit, currentContent } = useSelector((store) => store.gift);
  const { t } = useTranslation();
  const [types, setTypes] = useState<any>([]);

  const changeContent = (curConent) => {
    setContent((pre) => ({ ...pre, ...curConent }));
  };
  const initPreData = async () => {
    const { info } = await getContentTypes();
    const options = info.map((value) => ({ label: value, value }));
    setTypes(options);
  };

  useEffect(() => {
    if (isEdit) setContent(JSON.parse(JSON.stringify(currentContent)));
    initPreData();
  }, []);

  return (
    <div className="w-full h-full relative overflow-scrol  ">
      <div className="flex justify-between h-16 items-center px-3 ">
        <span className="font-bold text-md">新建Contents</span>
        <CloseOutlined onClick={dismiss} />
      </div>
      <div className="bg-@border1 h-[1px]" />
      {/* 表单 */}
      <div className="flex px-8 gap-8">
        <div className="flex flex-col gap-6 pt-8">
          <CategoryTitle title="Campaign Setting" />

          <div className="flex gap-4 ">
            <IconTile icon="gift" title={t('super.name')} />
            <Input
              className="w-[280px]"
              value={content?.name}
              onChange={(e) => changeContent({ name: e.target.value })}
            />
          </div>

          <div className="flex gap-4 ">
            <IconTile icon="gift" title={`${t('gift.type')}*`} />
            <Select
              className="w-[480px]"
              options={types}
              value={content?.type}
              onChange={(type) => changeContent({ type })}
            />
          </div>

          <div className="flex gap-4 ">
            <IconTile icon="config" title={`${t('gift.userConfigs')}*`} />
            <TextArea
              placeholder="Json area"
              rows={2}
              value={content?.userConfigs}
              onChange={(e) => changeContent({ userConfigs: e.target.value })}
            />
          </div>

          <div className="flex gap-4 ">
            <IconTile icon="config" title={`${t('gift.configs')}*`} />
            <TextArea
              placeholder="Json area"
              rows={3}
              value={content?.configs}
              onChange={(e) => changeContent({ configs: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col  absolute bottom-0 w-full gap-2 pb-2">
        <div className="bg-@border1 h-[1px]" />

        <div className="flex justify-end w-full px-4">
          <div
            className="w-20 bg-@MainGreen flex justify-center items-center rounded-lg h-8 text-white gap-2 hover:cursor-pointer hover:opacity-70"
            onClick={() => confrim(content)}
          >
            <CheckCircleOutlined />
            <span>{t('common.done')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
