import '@/configs/i18n';

import CampaignOutlet from '@/pages/Campaign/CampaignOutlet';
import PageLayout from '@/pages/PageLayout';
import store, { useAppDispatch } from '@/store';
import { setLoginRedirectSearchParams } from '@/store/userSlice';
import { ConfigProvider, intlMap } from '@ant-design/pro-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import 'antd/dist/antd.less';
import { ShopGiftCampaign } from './pages/Campaign/ShopGift';
import { ModalProvider } from './pages/modal/ModalProvider';
import { NotFound } from './pages/NotFound';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { search } = window.location;
  if (search) {
    dispatch(setLoginRedirectSearchParams(search));
  }

  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout />} path="/">
            <Route element={<CampaignOutlet />} path="shop_gift/*">
              <Route element={<ShopGiftCampaign />} index />
            </Route>
          </Route>
          <Route element={<NotFound />} path="/*" />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

const rootElement = document.getElementById('root');

const languageMap = {
  ja: 'ja-JP',
  zh: 'zh-CN',
  en: 'en-US',
};

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider
      value={{
        intl: intlMap[
          languageMap[localStorage.getItem('display-language') || 'ja'] ??
            'ja-JP'
        ],
        valueTypeMap: {},
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>,
  rootElement,
);
