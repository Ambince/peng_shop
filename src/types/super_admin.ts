export interface SuperContent {
  id?: number;
  name: string;
  type: ContentType;
  configs: string;
  userConfigs: string;
  version?: number;
  createdAt?: number;
  updatedAt?: number;
}

export enum ContentType {
  CONTROL = 'control',
  GIFT = 'gift',
  GIFT_V2 = 'gift_v2',
  GIFT_BLAST = 'gift_blast',
  SHOP = 'shop',
  SNS_SYNC_POPUP = 'sns_sync_popup',
  POPUP_BANNER = 'popup_banner',
  POPUP_BANNER_STATIC = 'popup_banner_static',
  REFUND_CAMPAIGN = 'refund_campaign',
  REFUND_CAMPAIGN_V2 = 'refund_campaign_v2',
  TWITTER_LOTTERY = 'twitter_lottery',
  NORMAL_LOTTERY = 'normal_lottery',
  OMIKUJI_LOTTERY = 'omikuji_lottery',
  DO_NOT_CHEAT = 'do_not_cheat',
  SURVEY = 'survey',
}
