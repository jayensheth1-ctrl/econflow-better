const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

/**
 * Central progress persistence layer.
 * If guest mode → read/write localStorage only.
 * If logged in  → call base44 DB.
 */

import { isGuestMode, getGuestProgress, saveGuestProgress } from "./guestProgress";

/**
 * Update user progress. Works for both guests and logged-in users.
 * @param {object} current - current progress object (must have .id for DB users)
 * @param {object} update  - partial fields to merge & persist
 * @returns {object} merged progress object
 */
export async function updateProgress(current, update) {
  const merged = { ...current, ...update };
  if (isGuestMode()) {
    saveGuestProgress(merged);
    return merged;
  }
  await db.entities.UserProgress.update(current.id, update);
  return merged;
}