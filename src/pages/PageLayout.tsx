import { authUrllMap, getAuthList } from '@/common/auxin/AuxinCommon';
import { urlSearchToParams } from '@/common/parseUrl';
import { USER_INFO, getLocalStorage, setLocalStorage } from '@/common/storage';
import { defaultUrl } from '@/constants';
import { useAppSelector } from '@/store';
import { SearchParams, getAccessToken } from '@/store/userSlice';
import { Layout } from 'antd';
import * as jose from 'jose';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { SiderMenu } from './SiderMenu';
import { SiderTitle } from './SiderTitle';

const { Content, Sider } = Layout;

function PageLayout(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [width, setWidth] = useState(256);
  const [isExpand, setIsExpand] = useState(true);

  const { loginRedirectSearchParams } = useAppSelector((state) => state.user);
  const [claimsEmail, setClaimsEmail] = useState('');
  const [dynamicClass, setDynamicClass] = useState<{
    page?: string;
    content?: string;
  }>({});
  const [initUrl, setInitUrl] = useState('');

  const checkAuth = (url) => {
    const auth = getAuthList();
    console.info(`[auth]`, auth);
    const authKey = authUrllMap[url];
    if (!authKey) return url;
    const isAuth = auth[authKey];
    if (isAuth) return url;
    const availableAuth = Object.keys(auth).filter((key) => auth[key]);
    const keys = Object.keys(authUrllMap);
    for (let i = 0; i < keys.length; i++) {
      const auth = authUrllMap[keys[i]];
      if (availableAuth.includes(auth)) return keys[i];
    }
  };

  const init = async () => {
    const pathArray = location.pathname.split('/');
    const currentPath = pathArray[pathArray.length - 1];
    const localUrl = localStorage.getItem('path') ?? '';
    const isContains = Object.values(authUrllMap).includes(localUrl);
    let url = isContains ? localUrl : defaultUrl;
    url = currentPath || url;
    if (loginRedirectSearchParams) {
      const params = urlSearchToParams(
        loginRedirectSearchParams,
      ) as SearchParams;

      if (params.code) {
        const result = await getAccessToken(params.code);
        if (result) setLocalStorage(USER_INFO, result);
      }
    }
    const userInfo = getLocalStorage(USER_INFO);
    if (userInfo && userInfo.access_token) {
      const claims = jose.decodeJwt(userInfo.access_token);
      setClaimsEmail(claims.email as string);
    }
    const authUrl = checkAuth(url);
    if (!authUrl) {
      navigate('error');
      return;
    }
    setInitUrl(authUrl);
    navigate(authUrl);
  };

  useEffect(() => {
    const pathArray = location.pathname.split('/');
    const currentPath = pathArray[pathArray.length - 1];
    if (initUrl !== currentPath) setInitUrl(currentPath);
  }, [location.pathname]);

  useEffect(() => {
    init();
  }, []);

  const onExpandClick = () => {
    if (isExpand) setWidth(48);
    else setWidth(256);
    setIsExpand(!isExpand);
  };

  const onClickPathCallback = (props) => {
    const { page, content, key } = props;
    setDynamicClass({ page, content });
  };

  return (
    <Layout className="w-srceen bg-white min-w-full">
      <Sider
        className="bg-white fixed overflow-y-scroll h-screen left-0 top-0 bottom-0 z-10 no-scrollbar border-r border-bg-@main-background"
        width={width}
      >
        <SiderTitle callback={() => onExpandClick()} isExpand={isExpand} />
        {initUrl && (
          <SiderMenu
            callback={(props) => onClickPathCallback(props)}
            isExpand={isExpand}
            url={initUrl}
          />
        )}
      </Sider>
      <Layout
        className={`${dynamicClass.page} ${isExpand ? ' ml-64' : 'ml-12'}  `}
      >
        <Content className={`${dynamicClass.content} overflow-hidden`}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default PageLayout;
