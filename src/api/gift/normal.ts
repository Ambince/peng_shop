import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';

import {
  convertCurrentCampaignToRequet,
  convertCurrentCampaignToUpdateRequet,
} from './commonGampaign';

const prefix = '/admin/v3/gift_campaign';

export const fetchNormalCampaigns = async (condition) => {
  const path = `${prefix}/normal/campaigns`;
  const response: any = await fetchApi(path, 'get', condition);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const create = async (campaignInfos) => {
  try {
    const request = convertCurrentCampaignToRequet(campaignInfos);
    if (!request) return;
    console.info(`[createNormal request]`, request);
    const path = `${prefix}/normal/campaigns`;
    const response = await fetchApi(path, 'post', request);
    console.info(`[createNormalresponse]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[create error]`, error);
    return false;
  }
};

export const update = async (campaignInfos) => {
  try {
    const request = convertCurrentCampaignToUpdateRequet(campaignInfos);
    console.info(`[updateNormal request]`, request);
    if (!request) return;
    const path = `${prefix}/normal/campaigns/${request.id}`;
    const response = await fetchApi(path, 'put', request);
    console.info(`[updateNormal response]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[update error]`, error);
    return false;
  }
};
