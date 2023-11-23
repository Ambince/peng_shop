import { fetchApi } from '@/common/fetch';
import { cleanObject } from '@/utils';

export interface CampaignGroupUpdate {
  content_id?: number;
  ratio?: number;
  rule_event_expression?: string;
  rule_event_parameters?: string;
}

export interface CampaignGroupCreate {
  campaign_id: number;
  content_id: number;
  group_name: string;
  ratio: number;
  rule_event_expression: string;
  rule_event_parameters: string;
}

export interface CampaignGroup {
  id: number | undefined;
  content_id: number | undefined;
  group_name: string;
  ratio: number | undefined;
  rule_event_expression: string;
  rule_event_parameters: string;
  additional_info: {
    gift_id: string;
  };
  gift_ids: string[];
  gift_id?: string;
}

export interface CampaignGroupManagement {
  id: number;
  campaign_id: number;
  content_id: number;
  group_name: string;
  ratio: number;
  rule_event_expression: string;
  rule_event_parameters: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface businessPurpose {
  info: Array<{
    id: number;
    purpose: string;
    version: number;
    createdAt: string;
    updatedAt: string;
  }>;
  error: string;
}

export const createCampaignGroup = async (
  param: CampaignGroupCreate,
  campaignId: number,
): Promise<void> => {
  await fetchApi(
    `/admin/v1/campaigns/${campaignId}/groups`,
    'post',
    cleanObject(param),
  );
};

export const updateCampaignGroup = async (
  param: CampaignGroupUpdate,
  campaignId: number,
  groupId: number,
): Promise<void> => {
  await fetchApi(
    `/admin/v1/campaigns/${campaignId}/groups/${groupId}`,
    'put',
    cleanObject(param),
  );
};

export const deleteCampaignGroup = async (
  campaignId: number,
  groupId: number,
): Promise<void> => {
  await fetchApi(
    `/admin/v1/campaigns/${campaignId}/groups/${groupId}`,
    'delete',
  );
};

export interface GetCampaignGroupsResponse {
  info: CampaignGroup[];
  error?: string;
}

export const fetchCampaignGroups = async (
  campaignId: number,
): Promise<GetCampaignGroupsResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/campaigns/${campaignId}/groups`,
    'get',
  );
  return result;
};

export const fetchGiftCampaignGroups = async (
  campaignId: number,
): Promise<GetCampaignGroupsResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/gift_campaign/campaigns/${campaignId}/groups`,
    'get',
  );
  return result;
};

export const fetchGiftCampaignGroupsV2 = async (
  campaignId: number,
): Promise<GetCampaignGroupsResponse> => {
  const result: any = await fetchApi(
    `/admin/v2/gift_campaign/campaigns/${campaignId}/groups`,
    'get',
  );
  return result;
};

export interface getCampaignAppIds {
  info: string[];
}

export const fetchCampaignAppIds = async (
  campaignType: string,
): Promise<getCampaignAppIds> => {
  const result: any = await fetchApi(
    `/admin/v1/campaigns/app_ids?campaign_type=${campaignType}`,
    'get',
  );
  return result;
};

export const fetchCampaignLanguages = async (): Promise<getCampaignAppIds> => {
  const result: any = await fetchApi(`/admin/v1/campaigns/languages`, 'get');
  return result;
};

export const updateCampaignStatus = async (
  campaignId: number,
  status: string,
): Promise<void> => {
  await fetchApi(`/admin/v1/campaigns/${campaignId}/status`, 'put', {
    status,
  });
};

export const fetchBusinessPurpose = async (): Promise<businessPurpose> => {
  const result: any = await fetchApi(`/admin/v1/util/business_purpose`, 'get');
  return result;
};
