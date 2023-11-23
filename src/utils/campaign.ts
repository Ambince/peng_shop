// FIXME: camelcase, transfer this in Axios default config.

import { t } from 'i18next';

interface segementConfig {
  segment_name: string;
  segment_type: string;
}

export const acquireUserTarget = (data: {
  isIncludeNewUser: boolean;
  segement_config?: segementConfig;
}): string => {
  const { segement_config } = data;

  if (segement_config && segement_config.segment_name === 'auxin_new_user') {
    return t('new_user');
  }
  if (
    segement_config &&
    segement_config.segment_name === 'auxin_existing_user'
  ) {
    return t('all_existing_user');
  }
  if (
    segement_config &&
    segement_config.segment_name === 'auxin_existing_user,auxin_new_user'
  ) {
    return t('auxin_existing_user,auxin_new_user');
  }
  if (segement_config && segement_config.segment_name) {
    return t(segement_config.segment_name);
  }

  return '';
};

export const acquireUserTargetV2 = (data: { segmentName: string }): string => {
  const { segmentName } = data;

  return t(segmentName);
};
