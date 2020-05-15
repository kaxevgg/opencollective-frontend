/**
 * Matches opencollective-api/server/lib/allowed-features.ts
 */

import { get } from 'lodash';

import { CollectiveType } from './constants/collectives';

export const FEATURES = {
  CONVERSATIONS: 'CONVERSATIONS',
  COLLECTIVE_GOALS: 'COLLECTIVE_GOALS',
  RECEIVE_EXPENSES: 'RECEIVE_EXPENSES',
  UPDATES: 'UPDATES',
  TRANSFERWISE: 'TRANSFERWISE',
  PAYPAL_PAYOUTS: 'PAYPAL_PAYOUTS',
};

const FeatureAllowedForTypes = {
  [FEATURES.CONVERSATIONS]: [CollectiveType.COLLECTIVE, CollectiveType.ORGANIZATION],
  [FEATURES.RECEIVE_EXPENSES]: [CollectiveType.COLLECTIVE, CollectiveType.EVENT],
  [FEATURES.UPDATES]: [CollectiveType.COLLECTIVE, CollectiveType.ORGANIZATION],
};

/**
 * A map of paths to retrieve the value of a feature flag from a collective
 */
export const FEATURE_FLAGS = {
  [FEATURES.CONVERSATIONS]: 'settings.features.conversations',
  [FEATURES.COLLECTIVE_GOALS]: 'settings.collectivePage.showGoals',
  [FEATURES.UPDATES]: 'settings.features.updates',
  [FEATURES.TRANSFERWISE]: 'settings.features.transferwise',
  [FEATURES.PAYPAL_PAYOUTS]: 'settings.features.paypalPayouts',
};

/**
 * Returns true if feature is allowed for this collective type, false otherwise.
 */
export const isFeatureAllowedForCollectiveType = (collectiveType, feature) => {
  const allowedTypes = FeatureAllowedForTypes[feature];
  return allowedTypes ? allowedTypes.includes(collectiveType) : true;
};

/**
 * Check if the given feature is activated for collective.
 */
const hasFeature = (collective, feature) => {
  if (!collective) {
    return false;
  }

  // Check collective type
  if (!isFeatureAllowedForCollectiveType(collective.type, feature)) {
    return false;
  }

  // Check opt-in flags
  const activationFlag = FEATURE_FLAGS[feature];
  if (activationFlag) {
    return Boolean(get(collective, activationFlag, false));
  }

  return true;
};

export default hasFeature;
