const signedInMobiles = new Set<string>();

export function registerSignedInMobile(mobile: string) {
  signedInMobiles.add(mobile);
  return { registered: true, subscribers: signedInMobiles.size };
}

export function getSignedInMobiles() {
  return [...signedInMobiles];
}
