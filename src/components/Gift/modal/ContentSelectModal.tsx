import { SuperContents } from '@/pages/Campaign/SuperAdmin/contents';
import React from 'react';

export function ContentSelectModal({ success }): JSX.Element {
  return (
    <div className="flex flex-col gap-2 ">
      <SuperContents callback={(record) => success(record)} isModal />
    </div>
  );
}
