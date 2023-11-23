/**
 * Open Fusion SSO auth login page at current tab
 * @param redirection the redirection path inside current app
 */
// export const openAuthLoginPageWithRedirection = (redirection: string): void => {
//   const state: AuthState = {
//     redirect: redirection,
//   };
//   // development settings: use staging origin with resource override
//   const origin =
//     process.env.NODE_ENV === 'development'
//       ? 'https://i18n.stg.g123.jp'
//       : window.location.origin;
//   const clientId =
//     process.env.NODE_ENV === 'development'
//       ? import.meta.env.VITE_APP_FUSION_AUTH_CLIENT_ID?.toString() ?? ''
//       : window.runtimeConfig.authClientId;
//   const params = {
//     client_id: clientId,
//     // fixed kv for fusion SSO
//     response_type: 'code',
//     // fixed kv for fusion SSO
//     scope: 'offline_access',
//     // the url which need to be kept inside the backend white list
//     // use a suffix '?' to avoid the bug from fusion with all the query params starting with a '&'
//     redirect_uri: encodeURI(`${origin}/#/login?`),
//     // the reserved attribute to pass cross the auth process to do further redirection etc.
//     state: JSON.stringify(state),
//   };
//   window.location.href = `${
//     import.meta.env.VITE_APP_FUSION_AUTH_URL
//   }/authorize${query(params)}`;
// };

/**
 * Open Fusion SSO auth logout page at current tab
 * @param redirection the redirection path inside current app
 */
// export const openAuthLogoutPageWithRedirection = (
//   redirection: string,
// ): void => {
//   const { origin } = window.location;
//   const clientId =
//     process.env.NODE_ENV === 'development'
//       ? import.meta.env.VITE_APP_FUSION_AUTH_CLIENT_ID?.toString() ?? ''
//       : window.runtimeConfig.authClientId;
//   const params = {
//     client_id: clientId,
//     post_logout_redirect_uri: encodeURI(`${origin}/#${redirection}`),
//   };
//   window.location.href = `${
//     import.meta.env.VITE_APP_FUSION_AUTH_URL
//   }/logout${query(params)}`;
// };

export const USER_INFO = 'USER_INFO';

export const getLocalStorage = (key: string): Record<string, any> | null => {
  try {
    const env = import.meta.env;
    if (key === USER_INFO && env.MODE === 'test-local') {
      const userInfo = JSON.parse(env.VITE_APP_USER_INFO);
      return userInfo;
    }

    const str = localStorage.getItem(`g123_auxin:${key}`);
    if (str) {
      return JSON.parse(str);
    }
    return null;
  } catch (error) {
    console.info(`[error]`, error);
    return null;
  }
};

export const setLocalStorage = (key: string, value): void => {
  localStorage.setItem(`g123_auxin:${key}`, JSON.stringify(value));
};
