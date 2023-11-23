import { fetchApi } from '@/common/fetch';
import { lineCamelTransfer } from '@/common/utils';
import {
  CampaignStatus,
  CreateCampaignV3Request,
  CreateGiftCampaignGroupV3,
  CreateGiftCampaignV3Detail,
  Group,
  RuleGroup,
} from '@/types/gift';

const prefix = '/admin/v3/campaigns';

export interface SelectProps {
  label: string;
  value: string;
}

export const initCondition: { [key: string]: any } = {
  pageIndex: 0,
  itemsPerPage: 9,
  segmentName: '',
  appId: 'seirei',
  campaignId: '',
  creationStartAt: '',
  creationEndAt: '',
  status: '',
  levelStart: '',
  levelEnd: '',
  totalCount: 0,
  deleted: 'false',
  flush: true,
};

export const getAllCampaigns = async (condition) => {
  const response: any = await fetchApi(prefix, 'get', condition);
  return lineCamelTransfer(response, 'lineToCamel');
};

export const deleteCampaignById = async (id: number) => {
  const path = `${prefix}/${id}`;
  const response = await fetchApi(path, 'delete');
  console.info(`[deleteCampaignById response]`, response);
};

export const updateCampaignStatus = async (id: number, checked: boolean) => {
  const path = `${prefix}/${id}/status`;
  const status = checked ? CampaignStatus.AVAILABLE : CampaignStatus.DISABLED;
  await fetchApi(path, 'put', { status });
};

export const updateBatchCampaignStatus = async (
  ids: number[],
  checked: boolean,
  callback: () => void,
) => {
  const allPromise: any[] = [];
  const status = checked ? CampaignStatus.AVAILABLE : CampaignStatus.DISABLED;
  ids.forEach(async (updateId) => {
    const promise = new Promise(async (resolve, _) => {
      const path = `${prefix}/${updateId}/status`;
      await fetchApi(path, 'put', { status });
      resolve(true);
    });
    allPromise.push(promise);
  });
  Promise.all(allPromise).then(() => callback());
};

export const deleteBatchCampaignByIds = async (
  ids: number[],
  callback: () => void,
) => {
  const allPromise: any[] = [];
  ids.forEach(async (id) => {
    const promise = new Promise(async (resolve, _) => {
      const path = `${prefix}/${id}`;
      await fetchApi(path, 'delete');
      resolve(true);
    });
    allPromise.push(promise);
  });
  Promise.all(allPromise).then(() => callback());
};

export const getGames = async () => {
  const path = `/admin/v1/util/platform_games`;
  const response: any = await fetchApi(path, 'get');
  return lineCamelTransfer(response, 'lineToCamel');
};
export const getGamesByType = async (purpose) => {
  const path = `/admin/v1/util/platform_games/gift_purpose/${purpose}`;
  const response: any = await fetchApi(path, 'get');
  return lineCamelTransfer(response, 'lineToCamel');
};

export const convertCurrentCampaignToRequet = (currentCampaignInfos) => {
  if (!currentCampaignInfos) return;
  const details: CreateGiftCampaignV3Detail[] = [] as any;
  for (const campaignItem of currentCampaignInfos) {
    const { campaign, groups: preGroups } = campaignItem;
    const firstGroup: Group = preGroups[0];
    if (firstGroup) {
      const firstRuleGroup: RuleGroup = firstGroup.ruleGroups[0];
      delete firstRuleGroup.ruleGroupOperation;
      const firstRule = firstRuleGroup.ruleList;
      if (firstRule[0]) delete firstRule[0].ruleOperation;
    }
    const groups: CreateGiftCampaignGroupV3[] = [];
    for (const group of preGroups) {
      const giftId = group?.giftInfo!.displayId;
      groups.push({
        giftId,
        ratio: group.ratio,
        ruleGroups: group.ruleGroups,
        contentId: group.contentId,
      });
    }

    if (campaign.segmentName) {
      campaign.segmentName = campaign.segmentName.split(',');
    } else {
      campaign.segmentName = ['auxin_existing_user', 'auxin_new_user'];
    }
    const detail: CreateGiftCampaignV3Detail = {
      ...campaign,
      groups,
    };
    details.push(detail);
  }
  return { details };
};

export const convertCurrentCampaignToUpdateRequet = (currentCampaignInfos) => {
  if (!currentCampaignInfos) return;
  const campaignItem = currentCampaignInfos[0];
  const { campaign, groups } = campaignItem;
  for (const group of groups) {
    group.giftId = group.giftInfo!.displayId;
  }
  const firstGroup: Group = groups[0];
  if (firstGroup) {
    const firstRuleGroup: RuleGroup = firstGroup.ruleGroups[0];
    delete firstRuleGroup.ruleGroupOperation;
    const firstRule = firstRuleGroup.ruleList;
    if (firstRule[0]) delete firstRule[0].ruleOperation;
  }
  const fileds = Object.keys(campaign);
  for (const key of fileds) {
    const value = campaign[key];
    if (!value) {
      delete campaign[key];
      continue;
    }
  }

  if (campaign.segmentName) {
    campaign.segmentName = campaign.segmentName.split(',');
  } else {
    campaign.segmentName = ['auxin_existing_user', 'auxin_new_user'];
  }
  campaign.status = CampaignStatus.DISABLED;
  return { ...campaign, groups };
};

export const convertCampaignForAllTypeCreate = (currentCampaignInfos) => {
  if (!currentCampaignInfos) return;
  console.info(`[convertCampaignForAllType]`, currentCampaignInfos);
  const campaignInfo = currentCampaignInfos[0];
  const { campaign, groups } = campaignInfo;

  const firstGroup: Group = groups[0];
  if (firstGroup) {
    const firstRuleGroup: RuleGroup = firstGroup.ruleGroups[0];
    delete firstRuleGroup.ruleGroupOperation;
    const firstRule = firstRuleGroup.ruleList;
    if (firstRule[0]) delete firstRule[0].ruleOperation;
  }
  const request = { groups } as CreateCampaignV3Request;
  const fileds = Object.keys(campaign);
  for (const key of fileds) {
    const value = campaign[key];
    if (!value) {
      delete campaign[key];
      continue;
    }
    request[key] = campaign[key];
  }
  const segmentName: any = request.segmentName;
  if (segmentName) {
    request.segmentName = segmentName.split(',');
  } else {
    request.segmentName = ['auxin_existing_user', 'auxin_new_user'];
  }
  const excludeSegmentName: any = request.excludeSegmentName;
  if (excludeSegmentName && !Array.isArray(excludeSegmentName)) {
    request.excludeSegmentName = excludeSegmentName.split(',');
  }
  if (!Array.isArray(request.appId)) request.appId = [request?.appId ?? ''];
  return request;
};

export const convertAllCampaignToUpdate = (currentCampaignInfos) => {
  if (!currentCampaignInfos) return;
  const campaignItem = currentCampaignInfos[0];
  const { campaign, groups } = campaignItem;
  const firstGroup: Group = groups[0];
  if (firstGroup) {
    const firstRuleGroup: RuleGroup = firstGroup.ruleGroups[0];
    delete firstRuleGroup.ruleGroupOperation;
    const firstRule = firstRuleGroup.ruleList;
    if (firstRule[0]) delete firstRule[0].ruleOperation;
  }
  const arrayKey = ['appId', 'lang'];
  const fileds = Object.keys(campaign);
  const updateKeys = ['isRepeatable'];
  for (const key of fileds) {
    const value = campaign[key];
    if (updateKeys.includes(key)) continue;
    if (typeof value === 'boolean') continue;
    if (!value) {
      delete campaign[key];
      continue;
    }
    if (arrayKey.includes(key) && campaign[key].length === 0) {
      delete campaign[key];
    }
  }

  const segmentName: any = campaign.segmentName;
  if (segmentName) {
    campaign.segmentName = segmentName.split(',');
  } else {
    campaign.segmentName = ['auxin_existing_user', 'auxin_new_user'];
  }
  const excludeSegmentName: any = campaign.excludeSegmentName;
  if (excludeSegmentName && excludeSegmentName.length > 0) {
    if (!Array.isArray(excludeSegmentName))
      campaign.excludeSegmentName = excludeSegmentName.split(',');
  }
  campaign.status = CampaignStatus.DISABLED;

  return { ...campaign, groups };
};

export const create = async (campaignInfos) => {
  try {
    const request = convertCampaignForAllTypeCreate(campaignInfos);
    if (!request) return;
    console.info(`[createAll request]`, request);
    const response = await fetchApi(prefix, 'post', request);
    console.info(`[createAll response]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[error]`, error);
    return false;
  }
};

export const update = async (campaignInfo) => {
  try {
    const request = convertAllCampaignToUpdate(campaignInfo);
    console.info(`[updateAll request]`, request);
    if (!request) return;
    const path = `${prefix}/${request.id}`;
    const response = await fetchApi(path, 'put', request);
    console.info(`[updateAll response]`, response);
    if (response?.error) return false;
    return true;
  } catch (error) {
    console.info(`[error]`, error);
    return false;
  }
};
