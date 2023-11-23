import { USER_INFO, getLocalStorage } from '@/common/storage';
import { GiftWidgetMode, IGiftWidgetPayload } from '@/types/gift';
import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

export function GiftContainer({ props, dissmiss, success }): JSX.Element {
  const giftUrl = import.meta.env.VITE_GIFT_URL;
  const [isReady, setIsReady] = useState(false);

  const messageHandler = async (event: MessageEvent) => {
    const { message, data } = event.data;
    if (message === 'selected-gift-pack') {
      const giftPickInfo = JSON.parse(data);
      success(giftPickInfo);
    }
    if (message === 'close') {
      setIsReady(false);
    }

    if (message === 'ready') {
      const userInfo = getLocalStorage(USER_INFO);
      console.info(`[authToken]`, userInfo?.access_token);
      const authToken = userInfo?.access_token;
      const frame = document.getElementById('gift-iframe') as HTMLIFrameElement;
      const payload: IGiftWidgetPayload = {
        authToken,
        appid: props.appid,
        status: props.status,
        language: props.language,
        supports_ai: props.supports_ai,
        price: props.price,
        not_price: '0',
      };
      if (props.mode === GiftWidgetMode.APPROVAL_COMPENSATION) {
        delete payload.not_price;
      }
      if (props.mode === GiftWidgetMode.PAID_GIFT) {
        delete payload.price;
        delete payload.supports_ai;
      }
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(payload, giftUrl);
        setIsReady(true);
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
          src={giftUrl}
          title="gift-iframe"
        />
      </div>
    </div>
  );
}
