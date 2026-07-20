export {
  getProfile,
  updateProfile,
  updateEmailPreferences,
  updateOrderNotifications,
  requestEmailChange,
  confirmEmailChange,
  getAvailableRoles,
  switchRole,
} from "./model/api";
export type { Profile, EmailPreferences, AvailableRole, UpdateProfileInput } from "./model/types";
