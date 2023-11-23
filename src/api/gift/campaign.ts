import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';

const prefix = '/admin/v1/util';

export const getCampaignTypes = async () => {
  const path = `${prefix}/campaign_types`;
  const response: any = await fetchApi(path, 'get');
  return lineCamelTransfer(response, 'lineToCamel');
};

export const getContentTypes = async () => {
  const path = `${prefix}/content_types`;
  const response: any = await fetchApi(path, 'get');
  return lineCamelTransfer(response, 'lineToCamel');
};

export const createNewToken = async (request) => {
  const path = `/admin/v3/shop_campaign/generate_token`;
  const response: any = await fetchApi(path, 'post', request);
  return lineCamelTransfer(response, 'lineToCamel');
};
