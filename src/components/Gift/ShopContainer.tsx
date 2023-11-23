import { USER_INFO, getLocalStorage } from '@/common/storage';
import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';

export function ShopContainer({ dissmiss, appid, url }): JSX.Element {
  const messageHandler = async (event: MessageEvent) => {
    const { message } = event.data;
    if (message === 'ready') {
      const userInfo = getLocalStorage(USER_INFO);
      console.info(`[authToken]`, userInfo?.access_token);
      const authToken = userInfo?.access_token;
      const frame = document.getElementById('gift-iframe') as HTMLIFrameElement;
      const payload: any = { authToken, isMarketplace: true, appid };
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(payload, url);
      }
    }
  };

  useEffect(() => {
    const messageListener = (event) => messageHandler(event);
    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  }, []);

  return (
    <div className="h-screen w-screen   bg-@textlable flex justify-center items-center p-16 fixed z-50 left-0 top-0 bottom-0">
      <div className="flex w-2/3 relative ">
        <CloseCircleOutlined
          className="absolute text-xl right-0 -top-8 text-white hover:cursor-pointer hover:opacity-70"
          onClick={() => dissmiss()}
        />
        <iframe
          className="w-full h-[600px] p-3 bg-white rounded "
          frameBorder="0"
          id="gift-iframe"
          sandbox="allow-scripts allow-same-origin"
          src={url}
          title="gift-iframe"
        />
      </div>
    </div>
  );
}
