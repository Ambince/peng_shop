import { setApplication } from '@/store/giftSlice';
import { CheckOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function GiftGameSelect({ callback, games, visible }): JSX.Element {
  const { appId } = useSelector((store) => store.gift);
  const [isVisible, setIsVisibel] = useState<boolean>(false);
  const dispatch = useDispatch();
  const divRef = useRef<any>(null);
  const onSelectGame = (game) => {
    dispatch(setApplication({ game }));
    callback();
  };

  const handleClickOutside = (event: any) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    const clickListener = (event) => handleClickOutside(event);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);

  useEffect(() => {
    setIsVisibel(visible);
  }, [visible]);

  return (
    <>
      {games.length > 0 && isVisible && (
        <div
          ref={divRef}
          className="w-[280px] absolute  top-12   rounded-md  bg-white border border-@border1"
          style={{ zIndex: 100 }}
        >
          <div className="overflow-y-scroll h-[270px] gap-2  p-2 flex flex-col w-full no-scrollbar">
            {games.map((game) => {
              return (
                <div
                  key={`game_select_${game.appId}`}
                  className="flex justify-between  w-full  items-center font-bold rounded hover:bg-@hover&disable p-1 hover:cursor-pointer "
                  onClick={() => onSelectGame(game)}
                >
                  <div className="flex gap-3 items-center h-7">
                    <Image
                      className="rounded-md"
                      fallback="/default_game.svg"
                      placeholder={
                        <Image
                          preview={false}
                          src="/default_game.svg"
                          width={24}
                        />
                      }
                      preview={false}
                      src={game?.faviconUrl ?? '/default_game.svg'}
                      width={24}
                    />
                    <span className="text-xs font-normal">{game.appId}</span>
                  </div>
                  {appId === game.appId && <CheckOutlined size={20} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
