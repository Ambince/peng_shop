import { COL_COUNT_CONFIG, GiftInfo, Group, MIN_WIDTH } from '@/types/gift';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GiftItem } from '../GiftItem';

export function LevelupCalendar({
  dataSource,
  condition,
}: {
  dataSource: any[];
  condition: any;
}): JSX.Element {
  const [currentWidthRange, setCurrentWidthRange] = useState<number[]>([0, 0]);
  const [currentColNum, setCurrentColNum] = useState(0);
  const [levelList, setLevelList] = useState<number[]>([]);
  const { levelInfo } = useSelector((store) => store.gift);

  const calculateMaxLevel = () => {
    const start = 1;
    const end = levelInfo.maxLevel;
    // if (condition.levelStart && condition.levelEnd)
    //   start = Number(condition.levelStart);
    const levels: number[] = [];
    for (let i = start; i <= end; i++) levels.push(i);
    return levels;
  };

  const getBorderClass = (index: number) => {
    let borderClass = '';

    if (index + currentColNum > levelInfo.maxLevel) {
      borderClass = borderClass.concat('border-b').concat(' ');
    }
    if (index % currentColNum === 0) {
      borderClass = borderClass.concat('border-r').concat(' ');
      return borderClass;
    }
    const rowCount = Math.ceil(levelInfo.maxLevel / currentColNum);
    const currentRow = Math.ceil(index / currentColNum);
    if (currentRow === rowCount && index === levelInfo.maxLevel) {
      borderClass = borderClass.concat('border-r').concat(' ');
      return borderClass;
    }
    return borderClass;
  };

  const getGifts = (level: number): GiftInfo[] => {
    const id = levelInfo.levelCampaignMap[level];
    const campaignInfo = dataSource.find((item) => item.campaign.id === id);
    if (!campaignInfo) return [];
    const { groups } = campaignInfo;
    return groups.map((item: Group) => item.giftInfo);
  };

  const getIsDisabled = (level: number) => {
    const id = levelInfo.levelCampaignMap[level];
    const campaignInfo = dataSource.find((item) => item.campaign.id === id);
    const { campaign } = campaignInfo;
    return campaign.status === 'disabled';
  };

  const getStartAndEndItemClass = (level: number) => {
    const id = levelInfo.levelCampaignMap[level];
    const campaignInfo = dataSource.find((item) => item.campaign.id === id);
    let itemClass = '';
    if (!campaignInfo) return itemClass;
    const { campaign } = campaignInfo;
    const isDisabled = campaign.status === 'disabled';
    if (isDisabled)
      itemClass = itemClass
        .concat('bg-@main-background border-@placeholder')
        .concat(' ');
    else
      itemClass = itemClass
        .concat('bg-@light-green-1 border-@tag-text-2')
        .concat(' ');
    for (const levelArray of levelInfo.levelSkip) {
      const levelStart: number = levelArray[0];
      const levelEnd: number = levelArray[1];
      // if (condition.levelStart && condition.levelEnd) {
      //   levelStart = Math.max(Number(condition.levelStart), levelStart);
      //   levelEnd = Math.min(Number(condition.levelEnd), levelEnd);
      // }

      if (level > levelStart && level < levelEnd) {
        itemClass = itemClass.concat('w-full').concat(' ');
        break;
      }

      if (level === levelStart && level === levelEnd) {
        itemClass = itemClass.concat('rounded-md one-level').concat(' ');
        break;
      }

      if (level === levelStart) {
        itemClass = itemClass.concat('rounded-l-md start-level').concat(' ');
        break;
      }

      if (level === levelEnd) {
        itemClass = itemClass.concat('rounded-r-md end-level').concat(' ');
        break;
      }
    }
    return itemClass;
  };

  const getCampaign = (level: number) => {
    const id = levelInfo.levelCampaignMap[level];
    const campaignInfo = dataSource.find((item) => item.campaign.id === id);
    if (!campaignInfo) return;
    return campaignInfo;
  };

  const isShowGiftItem = (level: number): boolean => {
    for (const levelArray of levelInfo.levelSkip) {
      const levelStart: number = levelArray[0];
      const levelEnd: number = levelArray[1];
      // if (condition.levelStart && condition.levelEnd) {
      //   levelStart = Math.max(Number(condition.levelStart), levelStart);
      //   levelEnd = Math.min(Number(condition.levelEnd), levelEnd);
      // }
      if (level % currentColNum === 1 && levelList.length > currentColNum) {
        return true;
      }
      if (levelStart === level) return true;
    }
    return false;
  };

  const isShowLevelItem = (level: number) => {
    for (const levelRange of levelInfo.levelSkip) {
      if (level >= levelRange[0] && level <= levelRange[1]) return true;
    }
    return false;
  };

  const findColCount = () => {
    const width = window.innerWidth;
    if (width >= currentWidthRange[0] && width <= currentWidthRange[1]) return;
    let minKey;
    let maxKey;
    for (const key in COL_COUNT_CONFIG) {
      if (Number(key) <= width) {
        minKey =
          minKey === undefined ? Number(key) : Math.max(minKey, Number(key));
      } else {
        maxKey =
          maxKey === undefined ? Number(key) : Math.min(maxKey, Number(key));
      }
    }
    minKey = minKey ?? MIN_WIDTH;
    maxKey = maxKey ?? minKey;
    setCurrentWidthRange([minKey, maxKey]);
    setCurrentColNum(
      minKey ? COL_COUNT_CONFIG[minKey] : COL_COUNT_CONFIG[MIN_WIDTH],
    );
  };

  useEffect(() => {
    findColCount();
    window.addEventListener('resize', findColCount);
    const levels = calculateMaxLevel();
    setLevelList(levels);
    return () => {
      window.removeEventListener('resize', findColCount);
    };
  }, [levelInfo]);

  const onManualScroll = useCallback(
    debounce((level) => {
      const target: any = document.getElementById(`calandar_${level}`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 300),
    [],
  );

  useEffect(() => {
    const { levelEnd, levelStart } = condition;
    const level = levelStart || levelEnd;
    if (Number(level) > 0) onManualScroll(level);
    else onManualScroll(1);
  }, [condition]);

  return (
    <>
      {dataSource && (
        <div
          className="no-scrollbar grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 mt-4 pb-8 h-[70vh] overflow-y-scroll"
          id="container"
        >
          {currentColNum > 0 &&
            levelList.map((level) => {
              return (
                <div
                  key={`calandar_${level}`}
                  className="flex h-48 flex-col gap-1 relative"
                  id={`calandar_${level}`}
                >
                  <div
                    className={`w-full h-full border-l border-t z-10 border-@border2 group ${getBorderClass(
                      level,
                    )}`}
                  >
                    <div className="flex justify-between px-2 h-5 p-1">
                      <span>Lv {level}</span>
                    </div>
                  </div>

                  {isShowLevelItem(level) && (
                    <div
                      className={`flex flex-col p-y-10 border-b-2  absolute top-10 z-20 pr-1  ${getStartAndEndItemClass(
                        level,
                      )} `}
                    >
                      {getGifts(level).map((gift, index) => {
                        return (
                          <GiftItem
                            key={`[calendar_gift_item_${level}_${index}]`}
                            campaignInfo={getCampaign(level)}
                            gift={gift}
                            isDisabled={getIsDisabled(level)}
                            isShow={isShowGiftItem(level)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
