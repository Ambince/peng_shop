import enUS from '@/configs/i18n/en-US.json';
// GM_SUPPORT: i18n translations
import jaJP from '@/configs/i18n/ja-JP.json';
import zhCN from '@/configs/i18n/zh-CN.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enUS,
    },
    ja: {
      translation: jaJP,
    },
    zh: {
      translation: zhCN,
    },
  },
  lng: localStorage.getItem('display-language') ?? 'ja',
  fallbackLng: 'ja',
  debug: true,
});

export default i18n;
