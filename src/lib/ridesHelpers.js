import { getStatus } from "../constants/statuses";

/* ═══════════════════════════════════════════════
   الفلترة — بالعنوان، المسار، نقطة الانطلاق
   ═══════════════════════════════════════════════ */

export function filterRides(rides, query) {
  const q = query.trim().toLowerCase();
  if (!q) return rides;

  return rides.filter(
    (r) =>
      r.title?.toLowerCase().includes(q) ||
      r.path?.toLowerCase().includes(q) ||
      r.meetingPoint?.toLowerCase().includes(q)
  );
}



export function pickFeatured(rides) {
  return rides.find((r) => getStatus(r.status).canBook) ?? rides[0];
}



export function pickRest(rides, featured) {
  if (!featured) return [];
  return rides.filter((r) => r.id !== featured.id);
}