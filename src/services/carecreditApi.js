import { apiGet, apiPost } from './api';

const BASE = '/carecredits';

export async function getCareCreditWallet() {
  return apiGet(`${BASE}/wallet`);
}

export async function validatePromoCode(code) {
  return apiPost(`${BASE}/validate-promo`, { code });
}

export async function purchaseCareCredits({ credits, phoneNumber, providerName }) {
  return apiPost(`${BASE}/purchase`, { credits, phoneNumber, providerName });
}

export async function verifyCareCreditPurchase(ref, pendingCredits) {
  return apiGet(`${BASE}/purchase/verify/${ref}?pendingCredits=${pendingCredits}`);
}

export async function withdrawCareCredits({ credits, phoneNumber }) {
  return apiPost(`${BASE}/withdraw`, { credits, phoneNumber });
}
