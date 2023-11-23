import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';

const prefix = '/admin/v1/util';

export const fetchVersions = async (condition) => {
  const path = `${prefix}/micro_app_meta`;
  const response: any = await fetchApi(path, 'get', condition);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const createVersion = async (request) => {
  const path = `${prefix}/micro_app_meta`;
  const response: any = await fetchApi(path, 'post', request);
  return lineCamelTransfer(response, 'lineToCamel');
};
