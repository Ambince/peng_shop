import { iconMap } from '@/pages/Campaign';
import { GiftCampaignType } from '@/types/gift';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function GiftCampaignTypeSelect({
  callback,
  dissmiss,
  parentRef,
}): JSX.Element {
  const { t } = useTranslation();
  const divRef = useRef<any>(null);

  const notShowTypes = [GiftCampaignType.ALL, GiftCampaignType.SHOP];

  const handleClickOutside = (event: any) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      !parentRef.current.contains(event.target)
    ) {
      dissmiss();
    }
  };

  const getCampaignTypeOptions = () => {
    return Object.values(GiftCampaignType).filter(
      (key) => !notShowTypes.includes(key),
    );
  };

  useEffect(() => {
    const clickListener = (event) => handleClickOutside(event);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  return (
    <div
      ref={divRef}
      className="flex flex-col  justify-center items-center rounded-lg w-min-40 px-2 py-4"
    >
      {getCampaignTypeOptions().map((type) => {
        return (
          <div
            key={`select_type_${type}`}
            className="hover:cursor-pointer hover:opacity-70 w-full h-8 gap-2 p-2 hover:bg-@hover&disable flex items-center justify-evenly rounded-lg"
            onClick={() => callback(type)}
          >
            <div className="flex w-8">{iconMap.get(type)}</div>
            <span className="flex-1">{t(`common.${type}`)}</span>
          </div>
        );
      })}
    </div>
  );
}
