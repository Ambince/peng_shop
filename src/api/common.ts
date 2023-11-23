import { fetchApi } from '@/common/fetch';
import { getLocalStorage, USER_INFO } from '@/common/storage';
import { cleanObject } from '@/utils';
import { RcFile } from 'antd/es/upload';

export type Page = {
  total_count: number;
  page_count: number;
  page_index: number;
  items_per_page: number;
};

export type EmptyResponse = {
  error?: string;
};

export interface InternalGifts {
  id: string;
  displayId: string;
  name: string;
  description: string;
  price: number;
  totalValue: number;
  status: string;
  purchaseLimit: string;
  priceValueRatio: number;
  appId: string;
  items: string;
  purchaseLimitAmount: number;
  frameNumber: number;
  supportsAI: true;
  payload: string;
  duration: number;
  vipPoints: number;
  amountToDiamonds: number;
  platformCreative: string;
  localPrice: string;
}

interface InternalGiftSearch {
  page_index: number;
  items_per_page: number;
  segments?: string;
  app_id: string;
}

interface TagMapping {
  info: Array<{
    id: number;
    tag_name: string;
    en: string;
    zh: string;
    ja: string;
    target_segment_name: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface getSegmentDataCountSearch {
  app_ids: string[];
  segment_name: string;
}

export interface GetGiftsByDataResponse {
  id: string;
  vipPoints: number;
  amountToDiamond: number;
  price: number;
  priceValueRatio: number;
  duration: number;
  purchaseLimitAmount: number;
  isAISupported: boolean;
  items: any;
}

export interface GetGiftCommonConfigsResponse {
  info: {
    app_id: string;
    gift_type: string;
    server_url: string;
  }[];
  error?: string;
}

export interface UploadFileResponse {
  info: string;
  error?: string;
  page: Page;
}

export interface GetRuleDefinitionResponse {
  info: Map<string, Map<string, string>>;
  error?: string;
  page: Page;
}

export interface PlatformGame {
  id: number;
  app_id: string;
  supportedLangs: string[];
  game_id: number;
  title: string;
  status: string;
}

export interface GetPlatformGameResponse {
  info: PlatformGame[];
}

export interface GetAuxinMicroAppMeta {
  info?: {
    app_version: string;
  };
}

export const getTagMapping = async (): Promise<TagMapping> => {
  const result: any = await fetchApi(`/admin/v1/util/tag_mapping`, 'get');
  return result;
};

export const getSegmentDataCount = async (
  param: getSegmentDataCountSearch,
): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v1/util/segment_data_count`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getInternalGifts = async (
  param: InternalGiftSearch,
): Promise<{
  info: Array<InternalGifts>;
}> => {
  const result: any = await fetchApi(
    `/admin/v2/gift_campaign/contents/internal_gifts`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getGiftsByData = async (
  param: any,
): Promise<GetGiftsByDataResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/contents/gifts/${param.app_id}/${param.gift_id}`,
    'get',
  );
  return result;
};

export const getGiftCommonConfigs = async (
  giftType: string,
): Promise<GetGiftCommonConfigsResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/contents/gift_common_configs?gift_type=${giftType}`,
    'get',
  );
  return result;
};

export const getRuleDefinitions =
  async (): Promise<GetRuleDefinitionResponse> => {
    const result: any = await fetchApi(
      `/admin/v1/group/rule_definition`,
      'get',
    );
    return result;
  };

export const getPlatformGames = async (): Promise<GetPlatformGameResponse> => {
  const result: any = await fetchApi(`/admin/v1/util/platform_games`, 'get');
  return result;
};

export const getPlatformPreEntryGames =
  async (): Promise<GetPlatformGameResponse> => {
    const result: any = await fetchApi(
      `/admin/v1/util/platform_pre_entry_games`,
      'get',
    );
    return result;
  };

export const getAuxinMicroAppMeta = async (): Promise<GetAuxinMicroAppMeta> => {
  const result: any = await fetchApi(`/admin/v1/util/micro_app_version`, 'get');
  return result;
};

export const getLotteryPrize = async (param: any): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/prize`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const postLotteryPrize = async (param: any): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/prize`,
    'post',
    cleanObject(param),
  );
  return result;
};

export const getLotteryAvailablePrizeValue = async (): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/prize/available_prize_value`,
    'get',
  );
  return result;
};

export const getLotteryAvailablePrizeCount = async (
  param: any,
): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/prize/available_prize_count`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const postGetCampaignToken = async (
  campaignId: number,
): Promise<any> => {
  const result: any = await fetchApi(
    `/admin/v1/util/external_campaign/get_campaign_token?campaign_id=${campaignId}`,
    'post',
    {},
  );
  return result;
};

export const uploadFileMultiple = async (
  files: RcFile[],
  lang: string,
  randomId: string | undefined,
): Promise<UploadFileResponse> => {
  const userInfo = getLocalStorage(USER_INFO);
  if (userInfo) {
    const filesData: any[] = [];

    files.forEach((file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('file_name', file.name);
      data.append('lang', lang);
      if (randomId) {
        data.append('random_id', randomId);
      }
      filesData.push(file);
    });

    const resp = await window.fetch('/admin/v1/contents/upload_multiple', {
      method: 'POST',
      body: filesData,
      headers: {
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    });
    if (!resp.ok) {
      throw new Error('Failed uploading, maybe duplicated on server');
    }
    return resp.json();
  }
  return Promise.reject();
};

export const uploadFile = async (
  file: RcFile,
  lang: string,
  randomId: string | undefined,
): Promise<UploadFileResponse> => {
  const userInfo = getLocalStorage(USER_INFO);
  if (userInfo) {
    const data = new FormData();
    data.append('file', file);
    data.append('file_name', file.name);
    data.append('lang', lang);
    if (randomId) {
      data.append('random_id', randomId);
    }
    const resp = await window.fetch('/admin/v1/contents/upload', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    });
    if (!resp.ok) {
      throw new Error('Failed uploading, maybe duplicated on server');
    }
    return resp.json();
  }
  return Promise.reject();
};
