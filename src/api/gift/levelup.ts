import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';

import {
  convertCurrentCampaignToRequet,
  convertCurrentCampaignToUpdateRequet,
} from './commonGampaign';

const prefix = '/admin/v3/gift_campaign';

export const fetchLevelups = async (condition) => {
  const path = `${prefix}/level_up/campaigns`;
  const response: any = await fetchApi(path, 'get', condition);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const update = async (campaignInfo) => {
  try {
    const request = convertCurrentCampaignToUpdateRequet(campaignInfo);
    console.info(`[updateLevel request]`, request);
    if (!request) return;
    const path = `${prefix}/level_up/campaigns/${request.id}`;
    const response = await fetchApi(path, 'put', request);
    console.info(`[updateLevel response]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[update error]`, error);
    return false;
  }
};

export const create = async (campaignInfos) => {
  try {
    const request = convertCurrentCampaignToRequet(campaignInfos);
    if (!request) return;
    console.info(`[createLevelup request]`, request);
    const path = `${prefix}/level_up/campaigns`;
    const response = await fetchApi(path, 'post', request);
    console.info(`[createLevelup response]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[create error]`, error);
    return false;
  }
};

export const getLevelRange = async (appId) => {
  const path = `${prefix}/level_up/campaigns/info`;
  const params = { appId, deleted: 0 };
  const response: any = await fetchApi(path, 'get', params);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const getGiftItemById = async (internalId: string): Promise<any> => {
  const path = `${prefix}/contents/internal_gifts`;
  const response: any = await fetchApi(path, 'get', { internalId });
  console.info(`[getGiftItemById response]`, response);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const getGiftPriceById = async (giftId, appid): Promise<any> => {
  const path = `${prefix}/contents/internal_gift_info`;
  const response: any = await fetchApi(path, 'get', { giftId, appid });
  console.info(`[getGiftItemById response]`, response);
  return lineCamelTransfer(response.info, 'lineToCamel');
};
