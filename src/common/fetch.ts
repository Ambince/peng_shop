import { paramsToUrlSearch } from '@/common/parseUrl';
import { getLocalStorage, USER_INFO } from '@/common/storage';

import { lineCamelTransfer } from './utils';

type Result = {
  page?: any;
  error?: string;
  info?: any;
};

export async function fetchApi(inputUrl: string, method: string, params?: any) {
  let url = inputUrl;
  const userInfo = getLocalStorage(USER_INFO);
  if (!userInfo || !userInfo.access_token) {
    localStorage.removeItem(`g123_auxin:${USER_INFO}`);
    window.location.href = `${import.meta.env.VITE_APP_AUTH_URL}/oauth2/login`;
    // https://event-admin.stg.g123.jp/oauth2/login
  } else {
    let response: Response | undefined;
    console.info(`[fetchApi]`, inputUrl);
    if (method === 'post' || method === 'put') {
      response = await window.fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.access_token}`,
        },
        body: JSON.stringify(lineCamelTransfer(params, 'camelToLine')),
      });
    }

    if (method === 'get' || method === 'delete') {
      if (params && method === 'get') {
        const search = paramsToUrlSearch(
          lineCamelTransfer(params, 'camelToLine'),
        );
        url = `${url}?${search}`;
      }
      response = await window.fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      });
    }

    if (method === 'upload') {
      const formData = new FormData();
      formData.append('file', params);
      response = await window.fetch(url, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
        },
        body: formData,
      });
    }

    if (!response) return {};

    if (response.status === 401) {
      window.location.href = `${
        import.meta.env.VITE_APP_AUTH_URL
      }/oauth2/login`;
      return {};
    }

    const result: Result = await response.json();
    return result;
  }
}
