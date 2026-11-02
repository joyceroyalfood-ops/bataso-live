function getGiftTier(amount, thresholds) {
  if (amount >= thresholds.largeGiftThreshold) return 'large';
  if (amount >= thresholds.smallGiftThreshold) return 'small';
  return 'tiny';
}

function calculateVipPoints(amount) {
  return Math.round(amount * 10);
}

export { getGiftTier, calculateVipPoints };
