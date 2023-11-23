import { Page } from '@/api';
import { fetchApi } from '@/common/fetch';
import { cleanObject } from '@/utils';

export interface Content {
  id: number;
  name: string;
  type: string;
  configs: string;
  user_configs: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCreateReq {
  name: string;
  type: string;
  configs: string;
  user_configs: string;
  random_id?: string;
}

export interface ContentUpdateReq {
  name?: string;
  type?: string;
  configs?: string;
  user_configs?: string;
  random_id?: string;
}

export interface GetContentsResponse {
  info: Content[];
  error?: string;
  page: Page;
}

export interface ContentSearch {
  page_index: number;
  items_per_page: number;
  content_type?: string;
  name?: string;
}

export interface RefundContent extends Content {
  ratio?: string;
  ratio_range?: {
    min: number;
    max: number;
  };
}

export interface OmikujiContent extends Content {
  ratio?: string;
  ratio_range?: {
    min: number;
    max: number;
  };
}

export const getContents = async (
  param: ContentSearch,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/contents`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getContentsV2 = async (
  param: ContentSearch,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/popup_campaign/contents`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getRefundContents = async (
  param: ContentSearch,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/refund_campaign/contents`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getOmikujiContents = async (
  param: ContentSearch,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/contents`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const postOmikujiContents = async (
  param: any,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/contents`,
    'post',
    cleanObject(param),
  );
  return result;
};

export const putOmikujiContents = async (
  contentId: string,
  data: any,
): Promise<void> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/contents/${contentId}`,
    'put',
    cleanObject(data),
  );
  return result;
};

export const getOmikujiContentsById = async (
  id: string,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(`/admin/v2/lottery/contents/${id}`, 'get');
  return result;
};

export const putOmikujiContentsById = async (
  id: string,
  data: any,
): Promise<GetContentsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/lottery/contents/${id}`,
    'get',
    cleanObject(data),
  );
  return result;
};

export const createContent = async (param: ContentCreateReq): Promise<void> => {
  const result: any = await fetchApi(
    `/admin/v1/contents`,
    'post',
    cleanObject(param),
  );
  return result;
};

export const updateContent = async (
  id: number,
  param: ContentUpdateReq,
): Promise<void> => {
  const result: any = await fetchApi(
    `/admin/v1/contents/${id}`,
    'put',
    cleanObject(param),
  );
  return result;
};
