import { getLevelRange } from '@/api/gift/levelup';
import {
  CampaignInfo,
  GIFT_LOCAL,
  GameInfo,
  GiftCampaignType,
  LevelRange,
  TriggerType,
} from '@/types/gift';
import { SuperContent } from '@/types/super_admin';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface SkipInfo {
  levelSkip: number[][];
  maxLevel: number;
  levelCampaignMap: { [key: number]: number };
}

export enum ABTest {
  TRIGGER = 2,
  GIFT = 3,
}

export enum ConfigModel {
  QUICK,
  PRO,
}

interface InitialState {
  levelInfo: SkipInfo;
  currentCampaignType: string;
  currentCampaignInfos: CampaignInfo[];
  appId: string;
  isEdit: boolean;
  isCopy: boolean;
  isCreate: boolean;
  flushPageType: GiftCampaignType | null;
  configModel: ConfigModel | null;
  application: GameInfo | null;
  abTestModel: ABTest | null;
  currentContent: SuperContent | null;
  allGames: GameInfo[] | null;
}

const initialState: InitialState = {
  levelInfo: {
    levelSkip: [] as any,
    maxLevel: 0,
    levelCampaignMap: {},
  } as SkipInfo,
  currentCampaignType: '',
  currentCampaignInfos: [],
  appId: '',
  isEdit: false,
  isCopy: false,
  isCreate: false,
  flushPageType: null as GiftCampaignType | null,
  configModel: ConfigModel.QUICK,
  application: null,
  abTestModel: null,
  currentContent: null,
  allGames: null,
};

export const getLevelInfo = createAsyncThunk(
  'level/getLevel',
  async (appId) => {
    console.info(`[appId getLevelInfo]`, appId);
    const { info } = await getLevelRange(appId);
    return info;
  },
);

export const giftSlice = createSlice({
  name: 'gift',
  initialState,
  reducers: {
    setCurrentGiftType: (state, action: PayloadAction<{ type: any }>) => {
      const { payload } = action;
      state.currentCampaignType = payload.type;
    },
    setApplication: (state, action: PayloadAction<{ game: GameInfo }>) => {
      const { payload } = action;
      state.application = payload.game;
      state.appId = state.application.appId;
      localStorage.setItem(GIFT_LOCAL.APP, JSON.stringify(payload.game));
    },
    setAllGames: (state, action: PayloadAction<{ games: GameInfo[] }>) => {
      const { payload } = action;
      state.allGames = payload.games;
    },
    setConfigModel: (state, action: PayloadAction<{ model: ConfigModel }>) => {
      const { payload } = action;
      state.configModel = payload.model;
    },
    setABTest: (state, action: PayloadAction<{ model: ABTest | null }>) => {
      const { payload } = action;
      state.abTestModel = payload.model;
    },
    eidtCampaign(
      state,
      action: PayloadAction<{ record: any; type: GiftCampaignType }>,
    ) {
      const { record, type } = action.payload;
      const purpose = record.campaign.purpose;
      if (purpose) {
        if (Number(purpose) >= 2) {
          state.abTestModel = Number(purpose);
        } else {
          state.configModel = Number(purpose);
        }
      }
      if (record.campaign.segmentConfig && !record.campaign.segmentName) {
        record.campaign.segmentName =
          record.campaign.segmentConfig?.segmentName;
      }
      state.currentCampaignType = type;
      state.isEdit = true;
      state.currentCampaignInfos = [record];
    },
    copyCampaign(
      state,
      action: PayloadAction<{ record: any; type: GiftCampaignType }>,
    ) {
      const { record, type } = action.payload;
      const copyRecord = JSON.parse(JSON.stringify(record));
      state.currentCampaignType = type;
      state.isEdit = true;
      state.isCopy = true;
      delete copyRecord.campaign.status;
      state.currentCampaignInfos = [copyRecord];
    },
    setNewCampaignInfo(
      state,
      action: PayloadAction<{
        params?: {
          type?: GiftCampaignType;
          init?: boolean;
          autoAdd?: boolean;
          retains?: { [key: string]: any };
          startAt?: number;
          endAt?: number;
        };
      }>,
    ) {
      const { params } = action.payload;
      if (params?.type) state.currentCampaignType = params.type;
      if (params?.init) state.currentCampaignInfos = [];
      const group: any = {
        id: 0,
        contentId: 0,
        groupName: '',
        ratio: 1,
        ruleGroups: [],
      };
      const campaign = { appId: '' } as any;

      if (state.currentCampaignType !== GiftCampaignType.ALL) {
        campaign.appId = state.appId;
      }
      if (state.currentCampaignType === GiftCampaignType.NORMAL) {
        campaign.createdAt = Date.now();
      }
      if (state.currentCampaignType === GiftCampaignType.MILESTONE) {
        group.ruleGroups = [{ ruleList: [{ parameters: { sec: '5' } }] }];
      }

      if (params?.autoAdd) {
        const ruleGroup = {
          ruleList: [
            {
              conditionName: TriggerType.GAME_LOADED,
              parameters: { sec: '5' },
            },
          ],
        };
        group.ruleGroups = [ruleGroup];
      }
      const retains = params?.retains;
      if (retains) {
        Object.keys(retains).forEach((key) => (campaign[key] = retains[key]));
      }

      const campaignInfo: CampaignInfo = { campaign, groups: [group] };
      state.currentCampaignInfos.push(campaignInfo);
    },
    updateCampaignByIndex: (
      state,
      action: PayloadAction<{ index: number; campaign: any }>,
    ) => {
      const { index, campaign } = action.payload;
      state.currentCampaignInfos[index] = campaign;
    },
    deleteCampainByIndex: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      state.currentCampaignInfos.splice(index, 1);
    },
    clearCampaign: (state) => {
      state.currentCampaignInfos = [];
      if (state.currentCampaignType !== GiftCampaignType.ALL)
        state.currentCampaignType = '';
      state.isEdit = false;
      state.isCopy = false;
      state.isCreate = false;
      state.abTestModel = null;
      state.configModel = ConfigModel.QUICK;
    },

    setEditType: (state, action: PayloadAction<{ isEdit: boolean }>) => {
      const { isEdit } = action.payload;
      state.isEdit = isEdit;
    },
    setIsCreate: (state, action: PayloadAction<{ isCreate: boolean }>) => {
      const { isCreate } = action.payload;
      state.isCreate = isCreate;
    },
    setEditContent: (
      state,
      action: PayloadAction<{ isEdit: boolean; content?: SuperContent }>,
    ) => {
      const { isEdit, content } = action.payload;
      state.isEdit = isEdit;
      if (isEdit && content) state.currentContent = content;
      else state.currentContent = null;
    },
    setLocalChoiceLevel: (
      state,
      action: PayloadAction<{ levels: number[] }>,
    ) => {
      const { levels } = action.payload;
      state.levelInfo.levelSkip.push([levels[0], levels[1]]);
    },
    clearLocalChoiceLevel: (
      state,
      action: PayloadAction<{ levels: number[] }>,
    ) => {
      const { levels } = action.payload;
      const preLevels = state.levelInfo.levelSkip;
      for (let i = 0; i < preLevels.length; i++) {
        const level = preLevels[i];
        if (level[0] === levels[0] && level[1] === levels[1]) {
          preLevels.splice(i, 1);
        }
      }
      console.info(preLevels);
      state.levelInfo.levelSkip = preLevels;
    },
    setFlushPageType: (
      state,
      action: PayloadAction<{ type: GiftCampaignType | null }>,
    ) => {
      const { type } = action.payload;
      state.flushPageType = type;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLevelInfo.fulfilled, (state, { payload }) => {
        const levelRanges: LevelRange[] = payload;
        let maxLevel = 0;
        state.levelInfo.levelSkip = [];
        for (const lvlInfo of levelRanges.filter((item) => !item.deleted)) {
          state.levelInfo.levelSkip.push([lvlInfo.level, lvlInfo.maxLevel]);
          maxLevel = Math.max(maxLevel, lvlInfo.maxLevel);
          for (let i = lvlInfo.level; i <= lvlInfo.maxLevel; i++) {
            state.levelInfo.levelCampaignMap[i] = lvlInfo.campaignId;
          }
        }
        state.levelInfo.maxLevel = maxLevel;
      })
      .addCase(getLevelInfo.rejected, (state, err) => {
        console.log('🚀 ~ rejected', state, err);
      });
  },
});

export const {
  setCurrentGiftType,
  setNewCampaignInfo,
  updateCampaignByIndex,
  clearCampaign,
  setEditType,
  setLocalChoiceLevel,
  setFlushPageType,
  deleteCampainByIndex,
  eidtCampaign,
  copyCampaign,
  setApplication,
  setABTest,
  setConfigModel,
  setEditContent,
  setAllGames,
  setIsCreate,
  clearLocalChoiceLevel,
} = giftSlice.actions;

export default giftSlice.reducer;
