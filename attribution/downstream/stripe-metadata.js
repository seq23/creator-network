export const ATTRIBUTION_KEYS = ['src_creator','src_platform','src_experiment','src_icp','src_franchise','src_cta'];
const MAX = 160;
export function normalizeAttribution(input = {}) {
  const out = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = typeof input[key] === 'string' ? input[key].trim().slice(0, MAX) : '';
    if (!value) return null;
    out[key] = value;
  }
  return out;
}
export function appendStripeMetadata(params, input) {
  const attr = normalizeAttribution(input);
  if (!attr) return false;
  for (const key of ATTRIBUTION_KEYS) params.set(`metadata[${key}]`, attr[key]);
  return true;
}
export function attributionFromStripeSession(session) {
  return normalizeAttribution(session && session.metadata ? session.metadata : {});
}
