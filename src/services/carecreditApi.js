import { apiGet, apiPost, getAccessToken } from './api';

const BASE = '/carecredits';

export async function getCareCreditWallet() {
  const token = getAccessToken();
  return apiGet(`${BASE}/wallet`, token);
}

export async function validatePromoCode(code) {
  const token = getAccessToken();
  return apiPost(`${BASE}/validate-promo`, { code }, token);
}

export async function purchaseCareCredits({ credits, phoneNumber, providerName }) {
  const token = getAccessToken();
  return apiPost(`${BASE}/purchase`, { credits, phoneNumber, providerName }, token);
}

export async function verifyCareCreditPurchase(ref, pendingCredits) {
  const token = getAccessToken();
  return apiGet(`${BASE}/purchase/verify/${ref}?pendingCredits=${pendingCredits}`, token);
}

export async function withdrawCareCredits({ credits, phoneNumber }) {
  const token = getAccessToken();
  return apiPost(`${BASE}/withdraw`, { credits, phoneNumber }, token);
}

