export { fetchDesignCatalogs } from "./catalogs/api";
export { emptyDesignCatalogs, type DesignCatalogs } from "./catalogs/types";
export { DESIGN_DOC_CATEGORIES, DESIGN_SPECIALTIES } from "./catalogs/specialists";
export type { DesignDocCategory, DesignDocCategoryCode, DesignSpecialty } from "./catalogs/specialists";

export { deleteDesignDocument, fetchDesignProfile, saveDesignProfile, uploadDesignDocument } from "./profile/api";
export { emptyDesignProfile, type DesignDocumentGroup, type DesignProfile } from "./profile/types";
export { DesignProfileFields } from "./profile/DesignProfileFields";

export {
  deleteDesignHolderDocument,
  fetchDesignHolderProfile,
  saveDesignHolderProfile,
  uploadDesignHolderDocument,
} from "./holder/api";
export { DesignHolderProfileFields } from "./holder/DesignHolderProfileFields";

export { designOrderDetails } from "./order/details";
export { emptyDesignOrderDetails, type DesignOrderDetails } from "./order/types";
export { DesignOrderFields } from "./order/DesignOrderFields";
