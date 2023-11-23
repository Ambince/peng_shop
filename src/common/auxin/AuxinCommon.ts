import {
  CampaignGiftProps,
  CampaignGiftV2Props,
  CampaignPopupProps,
  GetContentsResponse,
} from '@/api';
import { string2unix } from '@/common/format';
import { getLocalStorage, USER_INFO } from '@/common/storage';
import { LabeledValue } from 'antd/lib/select';
import * as jose from 'jose';
import moment from 'moment';

export function getAvailableCampaignType(): LabeledValue[] {
  return [{ label: 'NORMAL', value: 'normal' }];
}

export function getAvailableAppIds(): LabeledValue[] {
  return [
    { label: 'all', value: 'all' },
    { label: 'g123', value: 'g123' },
    { label: 'auo', value: 'auo' },
    { label: 'gandc', value: 'gandc' },
    { label: 'ginei', value: 'ginei' },
    { label: 'goblinslayer', value: 'goblinslayer' },
    { label: 'guruguru', value: 'guruguru' },
    { label: 'hachinan', value: 'hachinan' },
    { label: 'hyakka', value: 'hyakka' },
    { label: 'hyakka_en', value: 'hyakka_en' },
    { label: 'jashinchan', value: 'jashinchan' },
    { label: 'kantai', value: 'kantai' },
    { label: 'kingoflife', value: 'kingoflife' },
    { label: 'okashi', value: 'okashi' },
    { label: 'peachboy', value: 'peachboy' },
    { label: 'petergrill', value: 'petergrill' },
    { label: 'queensblade', value: 'queensblade' },
    { label: 'seiken', value: 'seiken' },
    { label: 'seirei', value: 'seirei' },
    { label: 'tenseikenja', value: 'tenseikenja' },
    { label: 'transformers', value: 'transformers' },
    { label: 'vividarmy', value: 'vividarmy' },
    { label: 'wixoss', value: 'wixoss' },
    { label: 'yamato', value: 'yamato' },
    { label: 'yowapeda', value: 'yowapeda' },
    { label: 'iseleve', value: 'yowapeda' },
  ];
}

export function getAvailableLanguage(): LabeledValue[] {
  return [
    { label: 'all', value: 'all' },
    { label: 'ja', value: 'ja' },
    { label: 'zh-TW', value: 'zh-TW' },
    { label: 'en', value: 'en' },
    { label: 'es', value: 'es' },
    { label: 'de', value: 'de' },
    { label: 'ko', value: 'ko' },
    { label: 'fr', value: 'fr' },
    // {label: 'es-ES', value: 'es-ES'},
    { label: 'it', value: 'it' },
    { label: 'nl', value: 'nl' },
    { label: 'pt', value: 'pt' },
    { label: 'id', value: 'id' },
    { label: 'tl', value: 'tl' },
    { label: 'vi', value: 'vi' },
    { label: 'th', value: 'th' },
  ];
}

export function getExclusiveType(): LabeledValue[] {
  return [{ label: 'transfer', value: 'transfer' }];
}

export function getSegmentType(): LabeledValue[] {
  return [
    { label: 'NONE', value: 'none' },
    { label: 'NORMAL', value: 'normal' },
  ];
}

export function getCampaignStatus(): LabeledValue[] {
  return [
    { label: 'available', value: 'available' },
    { label: 'pending', value: 'pending' },
    // {label: 'error', value: 'error'},
    { label: 'disabled', value: 'disabled' },
  ];
}

export function getPopupType(): LabeledValue[] {
  return [
    { label: 'transfer', value: 'transfer' },
    { label: 'pre_entry', value: 'pre_entry' },
  ];
}

export function getContentType(): LabeledValue[] {
  return [
    { label: 'popup_banner', value: 'popup_banner' },
    { label: 'popup_banner_static', value: 'popup_banner_static' },
  ];
}

const tMap = {
  campaign_setting: 'Campaign Setting',
  campaign_group: 'Campaign Group',
  group_setting: 'Group Setting',
  target_game: 'Target Game',
  purpose: 'Purpose',
  language: 'Language',
  user_segment: 'User Segment',
  campaign_duration: 'Campaign Duration',
  duration: 'Duration',
  regular_campagin: 'Regular Campaign?',
  firstpay: 'Firstpay',
  revenue: 'Revenue',
  all_existing_user: 'allExistingUser',
  all_users: 'allUsers',
  new_user: 'newUser',
  'nothing,auxin_new_user': 'newUser',
  'auxin_existing_user,auxin_new_user': 'allUsers',
  auxin_existing_user: 'allExistingUser',
  big_r: 'Big R',
  medium_r: 'Medium R',
  small_r: 'Small R',
  guest_user: 'Guest User',
  free_existing_user: 'Free Existing User',
  churn_user: 'Churn User',
  basic_info: 'Basic Information',
  cycle_time: 'Cycle Time',
};

function toHump(name) {
  return name.replace(/_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}

export function formatCampaignRequestPopup(
  data: CampaignPopupProps,
  contents: GetContentsResponse,
) {
  const res = { ...data };

  // set type
  res.type = 'popups';

  // set app_id
  if (Array.isArray(res.app_id) && res.app_id.includes('all')) {
    res.app_id = undefined;
  }

  // set languages
  if (
    res.lang &&
    Array.isArray(res.lang) &&
    res.lang.length > 0 &&
    res.lang[0] === 'all'
  ) {
    res.lang = undefined;
  }

  // set start_at & end_at
  if (res.duration_time) {
    res.start_at = string2unix(String(res.duration_time[0])) * 1000;
    res.end_at = string2unix(String(res.duration_time[1])) * 1000;
  }

  // set normal type
  res.segment_config.segment_type = 'normal';

  // set history retention
  if (res.history_retention) {
    res.history_retention *= 24;
  }

  let id = data.app_id;
  if (Array.isArray(id) && id.length > 1) {
    id = id.map((i) => {
      return `${i[0]}${i[1]}`;
    });
  }

  if (!res.purpose && res.groups) {
    res.purpose = '';
    res.groups.forEach((group) => {
      res.purpose += `${group.group_name.split('_')[0]}_`;
    });
    res.purpose = res.purpose.slice(0, res.purpose.length - 1);
  }

  res.name = `${id}_${
    tMap[data.segment_config?.segment_name] ||
    toHump(data.segment_config?.segment_name)
  }_${res.type}_${toHump(res.purpose) || ''}_${moment().format(
    'YYMMDDHHmmss',
  )}`;

  // set status disabled
  res.status = 'disabled';

  // set exclusive type
  if (contents && contents.info) {
    res.groups.forEach((group) => {
      const { content_id } = group;
      contents.info.forEach((content) => {
        const { id: contentIdInGroup, user_configs } = content;
        const configData = JSON.parse(user_configs);
        if (
          `${content_id}` === `${contentIdInGroup}` &&
          configData.popup_type === 'transfer'
        ) {
          res.exclusive_type = 'transfer';
        }
      });
    });
  }

  return res;
}

export function formatCampaignRequestRefund(data: CampaignPopupProps) {
  const res = { ...data };

  // set type
  res.type = 'refund_campaign';

  // set app_id
  if (Array.isArray(res.app_id) && res.app_id.includes('all')) {
    res.app_id = undefined;
  }

  // set languages
  if (
    res.lang &&
    Array.isArray(res.lang) &&
    res.lang.length > 0 &&
    res.lang[0] === 'all'
  ) {
    res.lang = undefined;
  }

  // set start_at & end_at
  if (res.duration_time) {
    res.start_at = string2unix(String(res.duration_time[0])) * 1000;
    res.end_at = string2unix(String(res.duration_time[1])) * 1000;
  }

  // set normal type
  res.segment_config.segment_type = 'normal';

  // set history retention
  if (res.history_retention) {
    res.history_retention *= 24;
  }

  let id = data.app_id;
  if (Array.isArray(id) && id.length > 1) {
    id = id.map((i) => {
      return `${i[0]}${i[1]}`;
    });
  }

  if (!res.purpose && res.groups) {
    res.purpose = '';
    res.groups.forEach((group) => {
      res.purpose += `${group.group_name.split('_')[0]}_`;
    });
    res.purpose = res.purpose.slice(0, res.purpose.length - 1);
  }

  res.name = `${id}_${
    tMap[data.segment_config?.segment_name] ||
    toHump(data.segment_config?.segment_name)
  }_${res.type}_${toHump(res.purpose) || ''}_${moment().format(
    'YYMMDDHHmmss',
  )}`;

  // set status disabled
  res.status = 'disabled';

  return res;
}

export function formatCampaignRequestOmikuji(data: CampaignPopupProps) {
  const res = { ...data };

  // set type
  res.type = 'external_campaign';

  // set app_id
  if (Array.isArray(res.app_id) && res.app_id.includes('all')) {
    res.app_id = undefined;
  }

  // set languages
  if (
    res.lang &&
    Array.isArray(res.lang) &&
    res.lang.length > 0 &&
    res.lang[0] === 'all'
  ) {
    res.lang = undefined;
  }

  // set start_at & end_at
  if (res.duration_time) {
    res.start_at = string2unix(String(res.duration_time[0])) * 1000;
    res.end_at = string2unix(String(res.duration_time[1])) * 1000;
  }

  // set normal type
  res.segment_config.segment_type = 'normal';

  // set history retention
  if (res.history_retention) {
    res.history_retention *= 24;
  }

  let id = data.app_id;
  if (Array.isArray(id) && id.length > 1) {
    id = id.map((i) => {
      return `${i[0]}${i[1]}`;
    });
  }

  if (!res.purpose && res.groups) {
    res.purpose = '';
    res.groups.forEach((group) => {
      res.purpose += `${group.group_name.split('_')[0]}_`;
    });
    res.purpose = res.purpose.slice(0, res.purpose.length - 1);
  }

  res.name = `${id}_${
    tMap[data.segment_config?.segment_name] ||
    toHump(data.segment_config?.segment_name)
  }_${res.type}_${toHump(res.purpose) || ''}_${moment().format(
    'YYMMDDHHmmss',
  )}`;

  // set status disabled
  res.status = 'disabled';

  return res;
}

export function formatCampaignRequestGift(data: CampaignGiftProps) {
  const res = { ...data };

  // set type
  res.type = 'gifts';

  // set app_id
  if (res.app_id === 'all') {
    res.app_id = undefined;
  } else {
    res.app_id = [res.app_id as string];
  }

  // set start_at & end_at
  if (res.duration_time) {
    res.start_at = string2unix(String(res.duration_time[0])) * 1000;
    res.end_at = string2unix(String(res.duration_time[1])) * 1000;
  }

  // set normal type
  res.segment_config.segment_type = 'normal';

  // set history retention
  if (res.history_retention) {
    res.history_retention *= 24;
  }

  // set status disabled
  res.status = 'disabled';

  // set groups
  const convertGroups = res.groups.map((group) => {
    const copy = { ...group };
    if (copy.gift_id) {
      copy.additional_info = {
        gift_id: copy.gift_id,
      };
    }
    return copy;
  });
  res.groups = convertGroups;

  res.name = moment().format('YYMMDDHHmmss');

  return res;
}

export function formatCampaignRequestGiftV2(data: CampaignGiftV2Props) {
  const res = { ...data };

  // set type
  res.type = 'advance_gifts';

  // set app_id
  if (res.app_id === 'all') {
    res.app_id = undefined;
  }

  // set start_at & end_at
  if (res.duration_time) {
    res.start_at = string2unix(String(res.duration_time[0])) * 1000;
    res.end_at = string2unix(String(res.duration_time[1])) * 1000;
  }

  // set history retention
  if (res.history_retention) {
    res.history_retention *= 24;
  }

  // set status disabled
  res.status = 'disabled';

  // set groups
  const { gift_ids, rule_event_expression, rule_event_parameters } =
    res.groups[0];
  res.gift_group = {
    gift_ids,
    rule_event_expression,
    rule_event_parameters,
  };
  res.groups = [];
  res.lang = [];

  return res;
}

export const getUserEmail = (): string => {
  const userInfo = getLocalStorage(USER_INFO);
  if (userInfo && userInfo.access_token) {
    const claims = jose.decodeJwt(userInfo.access_token);
    return claims.email as string;
  }
  return '';
};

export const isAdminUser = (): boolean => {
  const userInfo = getLocalStorage(USER_INFO);
  if (userInfo && userInfo.access_token) {
    const { role } = jose.decodeJwt(userInfo.access_token) as any;
    return role && role.includes('auxin:admin');
  }
  return false;
};

// auth_key===menu_parent_key
export const defalutAuthList = {
  gift_campaign: false,
  shop_gift_m: false,
  popup_campaign: false,
  refund_campaign: false,
  omikuji_campaign: false,
  super_admin: false,
  audience: false,
};

// key:url value: auth_key
export const authUrllMap = {
  new_gift_campaign: 'gift_campaign',

  shop_gift: 'shop_gift_m',

  bannerCampaign: 'popup_campaign',
  bannerContent: 'popup_campaign',

  refundCampaign: 'refund_campaign',
  refundContent: 'refund_campaign',

  omikujiCampaign: 'omikuji_campaign',
  omikujiContent: 'omikuji_campaign',
  omikujiPrize: 'omikuji_campaign',

  super_campaign: 'super_admin',
  super_contents: 'super_admin',
  super_version: 'super_admin',

  aud_segment: 'audience',
};

export const getAuthList = (): { [key: string]: boolean } => {
  const userInfo = getLocalStorage(USER_INFO);
  const authList = JSON.parse(JSON.stringify(defalutAuthList));
  if (userInfo && userInfo.access_token) {
    const { role } = jose.decodeJwt(userInfo.access_token) as any;

    if (role.includes('auxin:super_admin')) {
      Object.keys(authList).forEach((key) => (authList[key] = true));
      return authList;
    }

    if (role.includes('auxin:admin')) {
      delete authList.super_admin;
      Object.keys(authList).forEach((key) => (authList[key] = true));
      return authList;
    }

    if (role.includes('auxin:gift_user')) {
      authList.gift_campaign = true;
      authList.shop_gift_m = true;
    }

    if (role.includes('auxin:popup_user')) {
      authList.popup_campaign = true;
      authList.omikuji_campaign = true;
    }

    if (role.includes('auxin:refund_user')) {
      authList.refund_campaign = true;
    }
  }
  return authList;
};

export const isSuperAndAdmin = () => {
  const userInfo = getLocalStorage(USER_INFO);
  let isSuper = false;
  let isAdmin = false;
  if (userInfo && userInfo.access_token) {
    const { role } = jose.decodeJwt(userInfo.access_token) as any;
    if (role.includes('super:admin')) isSuper = true;
    if (role.includes('auxin:admin')) isAdmin = true;
  }
  return [isSuper, isAdmin];
};
