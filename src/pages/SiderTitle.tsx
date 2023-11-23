import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React from 'react';

export function SiderTitle({ isExpand, callback }): JSX.Element {
  return (
    <div
      className={`flex px-2 items-center h-[100px] ${
        isExpand ? 'justify-between' : 'justify-end'
      }`}
    >
      {isExpand && (
        <div className="flex items-center">
          <Image preview={false} src="./logo.svg" width={64} />
          <span className="font-bold text-black text-3xl">绿地商家联盟</span>
        </div>
      )}

      {isExpand && (
        <MenuFoldOutlined
          className="hover:opacity-70 hover:cursor-pointer"
          size={20}
          onClick={() => callback()}
        />
      )}

      {!isExpand && (
        <MenuUnfoldOutlined
          className="hover:opacity-70 hover:cursor-pointer"
          size={20}
          onClick={() => callback()}
        />
      )}
    </div>
  );
}
