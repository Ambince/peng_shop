export enum TriggerType {
  GAME_LOADED = 'sec_after_game_loaded',
  CLICK_G_BUTTON = 'sec_after_g_button_clicked',
  CHEAT_DETECT = 'sec_after_cheat_detect',
  IDLE = 'sec_after_idle',
  CANCEL_PAYMENT = 'sec_after_cancel_psp',
  FINISH_PAYMENT = 'sec_after_finish_psp',
  LEVEL_UP = 'sec_after_level_up',
  MILESTONE = 'sec_after_milestone',
}

export enum ShopTriggerType {
  GAME_LOADED = 'sec_after_game_loaded',
  LEVEL_UP = 'sec_after_level_up',
  MILESTONE = 'sec_after_milestone',
}

export enum GiftCampaignType {
  NORMAL = 'normal',
  LEVEL_UP = 'level_up_gifts',
  MILESTONE = 'milestone_gifts',
  ALL = 'ALL',
  SHOP = 'shop',
}

export enum CampaignStatus {
  AVAILABLE = 'available',
  DISABLED = 'disabled',
}

export enum CampaignType {
  NORMAL = 'normal',
  GIFTS = 'gifts',
  GIFTS_V2 = 'gifts_v2',
  SHOP = 'shop',
  ADVANCE_GIFTS = 'advance_gifts',
  LEVEL_UP_GIFTS = 'level_up_gifts',
  MILESTONE_GIFTS = 'milestone_gifts',
  BLAST_GIFTS = 'blast_gifts',
  POPUPS = 'popups',
  REFUND_CAMPAIGN = 'refund_campaign',
  REFUND_CAMPAIGN_V2 = 'refund_campaign_v2',
  SURVEY = 'survey',
  EXTERNAL_CAMPAIGN = 'external_campaign',
}

export enum GiftPurpose {
  REWARD = 'reward',
  IAA = 'iaa',
  SHOP = 'shop',
  FREE = 'free',
  NORMAL = 'normal',
}

export interface LevelRange {
  level: number;
  maxLevel: number;
  deleted: boolean;
  campaignId: number;
}

export interface GiftCampaign {
  campaign: Campaign;
  gifts: any[];
}
export interface FetchCampaignsResponse {
  info: Campaign[];
  page: CommonPage;
}

// User information in the system for ownership
export interface User {
  cid: string;
  uid: string;
  scp: string[];
  sub: string;
  name: string;
  email: string;
  role: string[];
  nickname: string;
}
export interface Application {
  appid: string;
  name: string;
  icon: string;
}

export enum GiftWidgetMode {
  APPROVAL_COMPENSATION = 'approval_compensation',
  PAID_GIFT = 'paid_gift',
}

export interface GiftWidgetConfig {
  status: 'PUBLISHED';
  supports_ai: boolean;
  mode: GiftWidgetMode;
  price: string;
  not_price: string;
}

export interface IGiftWidgetPayload {
  authToken: string;
  appid: string;
  status: string;
  language: string;
  supports_ai?: boolean;
  price?: string;
  not_price?: string;
}

export interface GiftPackItemEntity {
  item: GiftPackItem;
  quantity: number;
}

export interface GiftPackItem {
  displayId: string;
  name: string;
  value: number;
  image: string;
}

export interface ABTestGiftPack {
  percentage: number;
  giftPack: GiftInfo;
}

export interface InternalGiftItem {
  id: InternalGiftItemDetail;
  quantity: string;
}

export interface InternalGiftItemDetail {
  displayId: string;
  name: string;
  value: number;
  image: string;
}

export interface CommonPage {
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  itemsPerPage: number;
}

export interface Response {
  info?: any;
  error?: any;
  page?: CommonPage;
}

export interface Trigger {
  type: TriggerType;
  strategy: GiftCampaignType;
  content: {
    startLevel?: number;
    endLevel?: number;
    idleTime?: number;
    keyword?: string;
  };
  delay: number;
  id?: string;
}

export interface TriggerGroup {
  triggers: Trigger[];
  conjunctions: boolean[]; // true = AND, false = OR
  title: string;
  id?: string;
}

export interface TriggerContainer {
  triggerGroups: TriggerGroup[];
  conjunctions: boolean[]; // true = AND, false = OR
  selectedGiftPacks: GiftInfo[];
  title: string;
  id?: string;
}
export interface CampaignInfo {
  campaign: Campaign;
  groups: Group[];
  key?: string;
}

export interface Campaign {
  id: number;
  name: string;
  excludeSegmentName: any[];
  status: string;
  deleted: boolean;
  version: number;
  createdAt: number;
  updatedAt: number;
  purpose?: string;

  type: string;
  appId?: string;
  lang?: string & string[];
  priority: number;
  exclusiveType?: any;
  isRepeatable: boolean;
  segmentName: string;
  segmentConfig?: any;
  startAt: number;
  endAt?: number;
  historyRetention?: number;
  scheduler?: CampaignSchedulerSlim;
}

export interface Group {
  group: Record<string, any>;
  id?: number;
  contentId: number;
  groupName: string;
  ratio: number;
  ruleGroups: RuleGroup[]; // TriggerGroup
  giftInfo?: GiftInfo;
  giftId?: string;
}

export interface GiftInfo {
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
  items: ItemElement[];
  purchaseLimitAmount: number;
  frameNumber: number;
  supportsAI: boolean;
  payload: string;
  duration: number;
  vipPoints: number;
  amountToDiamonds: number;
  currency: string;
  localPrice: number;
}

export interface ItemElement {
  item: ItemItem;
  quantity: number;
}

export interface ItemItem {
  displayId: string;
  name: string;
  value: number;
  image: string;
}

export interface RuleGroup {
  ruleGroupOperation?: null | string;
  ruleList: RuleList[];
}

export interface RuleList {
  ruleOperation?: null | string;
  conditionName: string;
  parameters: Parameters;
}

export interface Parameters {
  sec?: string;
  step?: string;
  operator?: string;
  level?: string;
  maxLevel?: string;
  expression?: string;
  delaySec?: string;
}

export const MIN_WIDTH = 767;
export const MID_WIDTH = 1023;
export const LARGE_WIDTH = 1279;
export const MAX_WIDTH = 1535;

// key:screen px  value: how many number in a row
export const COL_COUNT_CONFIG: { [key: number]: number } = {
  767: 3,
  1023: 4,
  1279: 6,
  1535: 8,
};

export interface CreateGiftCampaignV3Request {
  details: CreateGiftCampaignV3Detail[];
}

export interface CreateGiftCampaignV3Detail {
  exclusiveType?: string;
  segmentName?: string[];
  excludeSegmentName?: string[];
  appId: string;
  lang?: string[];
  isRepeatable?: boolean;
  groups: CreateGiftCampaignGroupV3[];
  status?: string;
  startAt?: number;
  endAt?: number;
  historyRetention?: number;
}

export interface CreateGiftCampaignGroupV3 {
  contentId?: number;
  giftId: string;
  ruleGroups: RuleGroup[];
  ratio: number;
  readFromRecommend?: boolean;
}

export interface GameInfo {
  appId: string;
  gameId: string;
  id: string;
  title: string;
  faviconUrl: string;
}

export interface CreateCampaignV3Request {
  name: string;
  type: string;
  exclusiveType?: string;
  segmentName?: string[];
  excludeSegmentName?: string[];
  appId?: string[];
  lang?: string[];
  isIncludeNewUser: boolean;
  isRepeatable: boolean;
  priority: number;
  groups: CampaignGroupV3[];
  status?: CampaignStatus;
  startAt?: number;
  endAt?: number;
  historyRetention?: number;
  purpose?: string;
  scheduler?: CampaignSchedulerSlim;
}

export interface CampaignSchedulerSlim {
  startTimeCron: string;
  duration: number;
}
export interface CampaignGroupV3 {
  contentId: number;
  groupName: string;
  ratio: number;
  ruleGroups: RuleGroup[];
  giftId: string;
}

export enum GIFT_LOCAL {
  APP = 'GIFT_APP',
  TAB = 'GIFT_TAB',
}
