import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';
import { SuperContent } from '@/types/super_admin';

const prefix = '/admin/v1';

export const fetchContens = async (condition) => {
  const path = `${prefix}/contents`;
  const response: any = await fetchApi(path, 'get', condition);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const createContent = async (request) => {
  const path = `${prefix}/contents`;
  const response: any = await fetchApi(path, 'post', request);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const updateContent = async (request: SuperContent) => {
  const path = `${prefix}/contents/${request.id}`;
  const response: any = await fetchApi(path, 'put', request);
  return lineCamelTransfer(response, 'lineToCamel');
};
