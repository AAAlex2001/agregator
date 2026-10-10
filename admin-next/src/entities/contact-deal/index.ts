export { fetchDeal, fetchDeals, receiptUrl, releaseDeal } from "./api/deals";
export {
  DEAL_STATUS_LABELS,
  DEAL_STATUS_TONES,
  PARTY_LABELS,
  RECEIPT_STATUS_LABELS,
  RECEIPT_STATUS_TONES,
  RELEASE_ACTOR_LABELS,
  SIGNATURE_METHOD_LABELS,
  type Deal,
  type DealContract,
  type DealList,
  type DealListItem,
  type DealReceipt,
  type DealSignature,
  type DealStatus,
} from "./model/types";
export { default as DealContractPanel } from "./ui/deal-contract";
export { default as DealReceipts } from "./ui/deal-receipts";
export { default as DealSignatures } from "./ui/deal-signatures";
export { default as DealSummary } from "./ui/deal-summary";
export { default as DealsTable } from "./ui/deals-table";
