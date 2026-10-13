export {
  deleteForensicDocument,
  fetchForensicProfile,
  saveForensicProfile,
  uploadForensicDiploma,
  uploadForensicDocument,
} from "./profile/api";
export { emptyForensicProfile, type ForensicProfile, type ForensicWorkplaceKind } from "./profile/types";
export { ForensicProfileFields } from "./profile/ForensicProfileFields";

export { forensicOrderDetails } from "./order/details";
export { emptyForensicOrderDetails, type ForensicOrderDetails } from "./order/types";
export { ForensicOrderFields } from "./order/ForensicOrderFields";
