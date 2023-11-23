import { Image } from 'antd';
import React from 'react';

export function IconTile({ title, icon }): JSX.Element {
  return (
    <div className="flex gap-2 items-center min-w-[140px]">
      <Image
        className="rounded-md"
        preview={false}
        src={`/${icon}.svg`}
        width={20}
      />
      <span className="font-bold text-center"> {title}</span>
    </div>
  );
}
