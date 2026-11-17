import PocketBase from "pocketbase";

export const pb = new PocketBase(window.location.origin);

pb.autoCancellation(false);

export function authedSuperuser() {
  return pb.authStore.isValid && pb.authStore.isSuperuser;
}
