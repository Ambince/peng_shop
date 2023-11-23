import { InternalGifts, Page, CampaignGroup } from '@/api';
import { fetchApi } from '@/common/fetch';
import { cleanObject } from '@/utils';

export interface CampaignManagement {
  showLifeCycle?: boolean;
  id: number;
  name: string;
  type: string;
  segment_name: string;
  segment_config?: {
    segment_name: string;
    segment_type: string;
  };
  app_id?: string[];
  lang?: string[];
  is_include_new_user: boolean;
  is_repeatable: boolean;
  exclusive_type?: string;
  priority: number;
  status: string;
  status_for_display?: string;
  start_at: number;
  end_at?: number;
  history_retention?: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignManagementV2 {
  campaign: {
    showLifeCycle?: boolean;
    id: number;
    name: string;
    type: string;
    segment_name: string;
    segment_config?: {
      segment_name: string;
      segment_type: string;
    };
    app_id?: string[];
    lang?: string[];
    is_include_new_user: boolean;
    is_repeatable: boolean;
    exclusive_type?: string;
    priority: number;
    status: string;
    status_for_display?: string;
    start_at: number;
    end_at?: number;
    history_retention?: number;
    version: number;
    created_at: string;
    updated_at: string;
  };
  gifts: Array<InternalGifts>;
}

export interface GetCampaignsResponse {
  info: CampaignManagement[];
  error?: string;
  page: Page;
}

export interface GetCampaignsResponseV2 {
  info: CampaignManagementV2[];
  error?: string;
  page: Page;
}

export interface CampaignSearch {
  page_index: number;
  items_per_page: number;
  segments: string;
  campaign_type?: string;
  status?: string;
  name?: string;
  app_id?: string;
}

export interface CampaignPopupProps {
  type: string;
  app_id: string[] | undefined;
  lang: string[] | undefined;
  duration_time: string[];
  start_at: number;
  end_at: number;
  segment_config: {
    segment_name: string;
    segment_type: string;
  };
  history_retention: number;
  status: string;
  groups: CampaignGroup[];
  purpose: string;
  name: string;
  exclusive_type: string;
}

export interface CampaignGiftProps {
  type: string;
  app_id: string | string[] | undefined;
  duration_time: string[];
  start_at: number;
  end_at: number;
  segment_config: {
    segment_name: string;
    segment_type: string;
  };
  history_retention: number;
  purpose: string;
  status: string;
  groups: CampaignGroup[];
  name: string;
}

export interface CampaignGiftV2Props {
  type: string;
  app_id: string[] | string | undefined;
  duration_time: string[];
  start_at: number;
  end_at: number;
  segment_config: {
    segment_name: string;
    segment_type: string;
  };
  history_retention: number;
  purpose: string;
  status: string;
  groups: CampaignGroup[];
  gift_group: {
    gift_ids: string[];
    rule_event_expression: string;
    rule_event_parameters: string;
  };
  lang?: string[];
}

export interface CreateCampaignRequest {
  name: string;
  type: string;
  segment_config?: {
    segment_name: string;
    segment_type: string;
  };
  app_id?: string[];
  lang?: string[];
  is_include_new_user?: boolean;
  is_repeatable?: boolean;
  exclusive_type?: string;
  priority?: number;
  groups: CampaignGroup[];
  start_at?: number;
  end_at?: number;
  history_retention?: number;
}

export interface CampaignUpdate {
  name?: string;
  type?: string;
  segment_config?: {
    segment_name?: string;
    segment_type?: string;
  };
  purpose: string;
  app_id?: string[];
  lang?: string[];
  is_include_new_user?: boolean;
  is_repeatable?: boolean;
  exclusive_type?: string;
  priority?: number;
  status?: string;
  deleted?: boolean;
  start_at?: number;
  end_at?: number;
  history_retention?: number;
  duration_time?: string[];
}

export const getCampaigns = async (
  param: CampaignSearch,
): Promise<GetCampaignsResponse> => {
  const result: any = await fetchApi(
    `/admin/v1/campaigns`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const getCampaignsV2 = async (
  param: CampaignSearch,
): Promise<GetCampaignsResponseV2> => {
  const result: any = await fetchApi(
    `/admin/v2/gift_campaign/campaigns`,
    'get',
    cleanObject(param),
  );
  return result;
};

export const createCampaigns = async (
  param: CampaignPopupProps,
): Promise<void> => {
  await fetchApi(`/admin/v1/campaigns`, 'post', cleanObject(param));
};

export const createCampaignsV2 = async (
  param: CreateCampaignRequest,
): Promise<void> => {
  await fetchApi(
    `/admin/v2/gift_campaign/campaigns`,
    'post',
    cleanObject(param),
  );
};

export const updateCampaign = async (
  param: CampaignPopupProps,
  campaignId: number,
): Promise<void> => {
  await fetchApi(
    `/admin/v1/campaigns/${campaignId}`,
    'put',
    cleanObject(param),
  );
};

export const updateGiftCampaignV2 = async (
  param: CampaignUpdate,
  campaignId: number,
): Promise<void> => {
  await fetchApi(
    `/admin/v2/gift_campaign/campaigns/${campaignId}`,
    'put',
    cleanObject(param),
  );
};

export const deleteCampaign = async (campaignId: number): Promise<void> => {
  await fetchApi(`/admin/v1/campaigns/${campaignId}`, 'delete');
};
