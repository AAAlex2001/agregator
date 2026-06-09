export type {
  TicketStatus,
  TicketCategory,
  TicketAttachment,
  TicketMessage,
  SupportTicket,
} from "./model/types";
export { CATEGORY_LABEL, STATUS_LABEL } from "./model/types";

export { StatusBadge } from "./ui/StatusBadge";
export { TicketCard } from "./ui/TicketCard";
export { TicketHeader } from "./ui/TicketHeader";
export { MessageGroup } from "./ui/MessageGroup";

export {
  fetchTickets,
  fetchTicket,
  createTicket,
  replyToTicket,
} from "./api/tickets.api";
export type {
  CreateTicketPayload,
  ReplyPayload,
} from "./api/tickets.api";
