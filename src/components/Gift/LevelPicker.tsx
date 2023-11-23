import { GiftCampaignType } from '@/types/gift';
import { CheckCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Button, Input, Popover, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

function LevelPop({ callback, dissmiss, parentRef }): JSX.Element {
  const { levelInfo, currentCampaignType } = useSelector((store) => store.gift);
  const [originalSkipLevel, setOriginalSkipLevel] = useState<number[][]>([]);
  const [skipLevel, setSkipLevel] = useState<string>('');
  const [choiceLevels, setChoiceLevels] = useState<number[]>([]);
  const [size, ___] = useState(100);
  const [page, setPage] = useState(0);
  const [leftLevels, setLeftLevels] = useState<number[]>([]);
  const [rightLevels, setRightLevels] = useState<number[]>([]);
  const divRef = useRef<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (currentCampaignType === GiftCampaignType.LEVEL_UP)
      setOriginalSkipLevel(levelInfo.levelSkip);
  }, [levelInfo, currentCampaignType]);

  useEffect(() => {
    const lefts: number[] = [];
    const rights: number[] = [];
    const start = page * size;
    for (let i = 0; i < size / 2; i++) lefts.push(i + 1 + start);
    for (let i = 0; i < size / 2; i++) {
      rights.push(i + 1 + size / 2 + start);
    }
    setLeftLevels(lefts);
    setRightLevels(rights);
  }, [page, size]);

  const getLevel = (index: number) => {
    if (choiceLevels.length === 0) return null;
    if (!choiceLevels[index]) return null;
    if (choiceLevels.length === 1 && index === 0)
      return `Lv ${choiceLevels[0]}`;
    if (choiceLevels.length === 2) return `Lv ${choiceLevels[index]}`;
    return null;
  };

  const isLevelRangeForbidden = (level: number) => {
    let forbidden = false;
    const min = Math.min(choiceLevels[0], level);
    const max = Math.max(choiceLevels[0], level);
    for (const originalItem of originalSkipLevel) {
      for (let i = originalItem[0]; i <= originalItem[1]; i++) {
        if (i >= min && i <= max) {
          forbidden = true;
          break;
        }
      }
    }
    return forbidden;
  };

  const isLevelForbidden = (level: number) => {
    let forbidden = false;
    for (const originalItem of originalSkipLevel) {
      if (level >= originalItem[0] && level <= originalItem[1]) {
        forbidden = true;
        break;
      }
    }
    return forbidden;
  };

  const checkLevelChangeValid = (level: number) => {
    let forbidden = isLevelForbidden(level);
    if (choiceLevels.length > 1) choiceLevels.length = 0;
    if (choiceLevels.length === 1) forbidden = isLevelRangeForbidden(level);
    if (forbidden) {
      notification.error({
        message: 'Level Error',
        description: 'This level can not select',
      });
      return false;
    }
    const levels = JSON.parse(JSON.stringify(choiceLevels));
    levels.push(level);
    levels.sort((pre, next) => (pre > next ? 1 : -1));
    setChoiceLevels(levels);
    return true;
  };

  const getChoiceClass = (level: number) => {
    let compareLevel: number[] = [];
    let choiceClass = 'hover:cursor-pointer';
    for (const originalItem of originalSkipLevel) {
      if (level >= originalItem[0] && level <= originalItem[1]) {
        compareLevel.push(originalItem[0], originalItem[1]);
        break;
      }
    }
    do {
      const normalClass = 'bg-@MainGreen text-white'.concat(' ');
      const selectedClass =
        'bg-@gray-bg text-@textdisable hover:cursor-not-allowed'.concat(' ');
      const choicedClass =
        compareLevel.length === 0 ? normalClass : selectedClass;
      compareLevel = compareLevel.length === 0 ? choiceLevels : compareLevel;
      if (compareLevel.length === 0) break;
      if (compareLevel.length === 1) {
        if (level !== compareLevel[0]) break;
        choiceClass = choicedClass;
        choiceClass = choiceClass.concat('rounded-lg').concat(' ');
        break;
      }
      if (level < compareLevel[0] || level > compareLevel[1]) break;
      choiceClass = choicedClass;
      if (level === compareLevel[0] || level % 5 === 1) {
        choiceClass = choiceClass.concat('rounded-l-lg').concat(' ');
      }
      if (level === compareLevel[1] || level % 5 === 0) {
        choiceClass = choiceClass.concat('rounded-r-lg').concat(' ');
      }
    } while (false);
    return choiceClass;
  };

  const getDoneClass = () => {
    if (choiceLevels.length === 2) {
      return 'text-white bg-@MainGreen border-@MainGreen';
    }
    return 'text-@textdisable bg-@hover&disable border-@border1';
  };

  const onSkip = () => {
    if (!skipLevel) return;
    const isVaild = checkLevelChangeValid(Number(skipLevel));
    if (!isVaild) return;
    let calculatePage = Math.floor(Number(skipLevel) / size);
    if (Number(skipLevel) % size === 0) calculatePage -= 1;
    setPage(calculatePage);
  };

  const handleClickOutside = (event: any) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      !parentRef.current.contains(event.target)
    ) {
      dissmiss();
    }
  };

  useEffect(() => {
    const clickListener = (event) => handleClickOutside(event);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  return (
    <div ref={divRef} className="flex flex-col p-2 gap-2 w-[500px] rounded-lg">
      {/* title */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          <span
            className={` ${getLevel(0) ? ' font-bold' : 'text-gray-200'}  `}
          >
            {getLevel(0) ?? t('gift.start_level')}
          </span>
          <span>～</span>
          <span
            className={` ${getLevel(1) ? ' font-bold' : 'text-gray-200'}  `}
          >
            {getLevel(1) ?? t('gift.end_level')}
          </span>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Input
            className="w-14"
            type="number"
            value={skipLevel}
            onChange={(e) => setSkipLevel(e.target.value)}
          />
          <span
            className="bg-gray-100 py-1 px-2 flex items-center justify-center rounded-md text-gray-800 text-xs hover:cursor-pointer hover:opacity-70"
            onClick={() => onSkip()}
          >
            {t('jump')}
          </span>
        </div>
      </div>

      <div className="bg-gray-200 h-[1px]" />

      {/* change level page */}

      <div className="flex justify-between w-full">
        <div
          className="flex-1 relative flex justify-center"
          onClick={() => setPage(Math.max(page - 1, 0))}
        >
          <span className="absolute left-0 text-gray-400 hover:cursor-pointer hover:opacity-60">
            {`<`}
          </span>

          <span className="font-bold">
            {t('gift.level')} {page * size + 1} - {size / 2 + page * size}
          </span>
        </div>

        <div className="flex-1 relative flex justify-center">
          <span className="font-bold">
            {t('gift.level')} {size / 2 + 1 + page * size}-{size + page * size}
          </span>
          <span
            className="absolute right-0 text-gray-400 hover:cursor-pointer hover:opacity-60"
            onClick={() => setPage(page + 1)}
          >
            {`>`}
          </span>
        </div>
      </div>

      {/* level body */}
      <div className="flex gap-4 flex-1 w-full">
        <div className="flex-1 flex-wrap grid grid-cols-5 gap-y-1">
          {leftLevels.map((level) => {
            return (
              <div
                key={`${level}`}
                className={`flex items-center justify-center hover:opacity-90 ${getChoiceClass(
                  level,
                )}`}
                onClick={() => checkLevelChangeValid(level)}
              >
                <div className="flex items-center justify-center hover:opacity-90">
                  {level}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-1 flex-wrap grid grid-cols-5 gap-y-1">
          {rightLevels.map((level) => {
            return (
              <div
                key={`${level}`}
                className={`flex items-center justify-center hover:opacity-90 ${getChoiceClass(
                  level,
                )}`}
                onClick={() => checkLevelChangeValid(level)}
              >
                <div className="flex items-center justify-center hover:opacity-90">
                  {level}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-200 h-[1px]" />

      {/* level bottom button */}
      <div className="flex justify-between">
        <Button size="small" onClick={() => setChoiceLevels([])}>
          Clear
        </Button>
        <Button
          className={getDoneClass()}
          icon={<CheckCircleOutlined />}
          size="small"
          onClick={() => callback(choiceLevels)}
        >
          {t('common.done')}
        </Button>
      </div>
    </div>
  );
}

export function LevelPicker({
  callback,
  defaultLevel,
}: {
  defaultLevel?: number[];
  callback: (levels) => void;
}): JSX.Element {
  const [choiceLevels, setChoiceLevels] = useState<number[] | undefined>();
  const [open, setOpen] = useState(false);
  const parentRef = useRef<any>(null);
  const { t } = useTranslation();

  const selectCallback = (levels) => {
    setChoiceLevels(levels);
    setOpen(false);
    callback(levels);
  };
  useEffect(() => {
    if (defaultLevel) setChoiceLevels(defaultLevel);
  }, [defaultLevel]);

  return (
    <Popover
      content={
        <LevelPop
          callback={(levels) => selectCallback(levels)}
          dissmiss={() => setOpen(false)}
          parentRef={parentRef}
        />
      }
      destroyTooltipOnHide
      open={open}
      placement="bottom"
      trigger="click"
    >
      <div
        ref={parentRef}
        className="w-40 h-8 border border-@border1 rounded gap-2 flex justify-center items-center hover:cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`${choiceLevels ? 'text-black' : 'text-@placeholder'}`}
        >
          {choiceLevels ? choiceLevels[0] : t('gift.level')}
        </span>
        <SwapRightOutlined className="text-@placeholder" />
        <span
          className={`${choiceLevels ? 'text-black' : 'text-@placeholder'}`}
        >
          {choiceLevels ? choiceLevels[1] : t('gift.level')}
        </span>
      </div>
    </Popover>
  );
}
