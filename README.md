# g123-auxin-admin

# vite-react-ts-teamplate

A react + ts template using vite

# SSO inner projects' frontend reference docs

## 1.Background

docs: https://ctw-inc.atlassian.net/wiki/spaces/GTA/pages/9109562/SSO

## 2.APIs (TODO)

- exchange: use `code` to get the loginInfo

- refresh: use `refreshToken` to get the loginInfo

### 2.1.The client id

There is a speficied `clientId` used for each App for each environment, please define it inside the env files or the runtime configs.

### 2.2.The white list

The SSO API only accept certain redirecting url after a successful login, please notice the devOps/backend about the frontend domain/origin with the relative path you want to set.

Since developing locally using `localhost` could be blocked due to the above reason, there is a work-around for such a case: use staging url then replacing the resource from the `staging` to `localhost` after the login process. You can achieve that via a chrome extension named [resource-overrides](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii?hl=en), to find more details, check the docs [here](https://github.com/G123-jp/g123-i18n#4-local-dev-with-auth)

Notice that the logout don't have such limitation.

### 2.3.The customizable payload

The current SSO implementation enable us to carry some customized info across the auth process by using the attribute `state`, for exmaple, further redirection target could be added there to enable use make another redirect after a successful login backing to the page we defined within the white list.

## 3,Sample of frontend implementation

```jsx
/**
 * Open Fusion SSO auth login page at current tab 
 * @param redirection the redirection path inside current app
 */
export const openAuthLoginPageWithRedirection = (redirection: string): void => {
  const state: AuthState = {
    redirect: redirection,
  };
  // development settings: use staging origin with resource override
  const origin =
    process.env.NODE_ENV === 'development'
      ? 'https://i18n.stg.g123.jp'
      : window.location.origin;
  const clientId =
    process.env.NODE_ENV === 'development'
      ? import.meta.env.VITE_APP_FUSION_AUTH_CLIENT_ID?.toString() ?? ''
      : window.runtimeConfig.authClientId;
  const params = {
    client_id: clientId,
    // fixed kv for fusion SSO
    response_type: 'code',
    // fixed kv for fusion SSO
    scope: 'offline_access',
    // the url which need to be kept inside the backend white list
    // use a suffix '?' to avoid the bug from fusion with all the query params starting with a '&'
    redirect_uri: encodeURI(`${origin}/#/login?`),
    // the reserved attribute to pass cross the auth process to do further redirection etc.
    state: JSON.stringify(state),
  };
  window.location.href = `${
    import.meta.env.VITE_APP_FUSION_AUTH_URL
  }/authorize${query(params)}`;
};

/**
 * Open Fusion SSO auth logout page at current tab
 * @param redirection the redirection path inside current app
 */
export const openAuthLogoutPageWithRedirection = (
  redirection: string,
): void => {
  const { origin } = window.location;
  const clientId =
    process.env.NODE_ENV === 'development'
      ? import.meta.env.VITE_APP_FUSION_AUTH_CLIENT_ID?.toString() ?? ''
      : window.runtimeConfig.authClientId;
  const params = {
    client_id: clientId,
    post_logout_redirect_uri: encodeURI(`${origin}/#${redirection}`),
  };
  window.location.href = `${
    import.meta.env.VITE_APP_FUSION_AUTH_URL
  }/logout${query(params)}`;
};
```

## 4.Notice points

### 4.1.Expected behavior (TODO)

### 4.2.Throttle failed SSO requests (TODO)

### Temp Basic Auth
Username: g123_event
Password: temp_testUser!

