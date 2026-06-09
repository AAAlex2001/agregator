import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type {
  SupportTicket,
  TicketAttachment,
  TicketCategory,
  TicketStatus,
} from "../model/types";

interface ApiAttachment {
  name: string;
  url: string;
}

interface ApiMessage {
  id: number;
  author: "user" | "support";
  author_name: string;
  text: string;
  created_at: string;
  attachments: ApiAttachment[];
}

interface ApiTicketSummary {
  id: number;
  number: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  has_unread: boolean;
  last_message_preview: string;
}

interface ApiTicketDetail extends ApiTicketSummary {
  messages: ApiMessage[];
}

interface ApiTicketList {
  items: ApiTicketSummary[];
  has_more: boolean;
}

function mapAttachment(a: ApiAttachment): TicketAttachment {
  return { name: a.name, url: a.url };
}

function mapTicketSummary(t: ApiTicketSummary): SupportTicket {
  return {
    id: t.id,
    number: t.number,
    subject: t.subject,
    category: t.category,
    status: t.status,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    hasUnread: t.has_unread,
    lastMessagePreview: t.last_message_preview ?? "",
    messages: [],
  };
}

function mapTicketDetail(t: ApiTicketDetail): SupportTicket {
  return {
    ...mapTicketSummary(t),
    messages: t.messages.map((m) => ({
      id: m.id,
      author: m.author,
      authorName: m.author_name,
      text: m.text,
      createdAt: m.created_at,
      attachments: m.attachments.map(mapAttachment),
    })),
  };
}

export async function fetchTickets(skip = 0, limit = 50): Promise<{
  items: SupportTicket[];
  hasMore: boolean;
}> {
  const res = await fetchWithSession(
    `${API_URL}/support/tickets?skip=${skip}&limit=${limit}`,
  );
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))).detail;
    throw new Error(detail || "Не удалось загрузить обращения");
  }
  const data = (await res.json()) as ApiTicketList;
  return { items: data.items.map(mapTicketSummary), hasMore: data.has_more };
}

export async function fetchTicket(ticketId: number): Promise<SupportTicket> {
  const res = await fetchWithSession(`${API_URL}/support/tickets/${ticketId}`);
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))).detail;
    throw new Error(detail || "Не удалось загрузить обращение");
  }
  const data = (await res.json()) as ApiTicketDetail;
  return mapTicketDetail(data);
}

export interface CreateTicketPayload {
  subject: string;
  category: TicketCategory;
  message: string;
  files: File[];
}

export async function createTicket(p: CreateTicketPayload): Promise<SupportTicket> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("subject", p.subject);
    fd.append("category", p.category);
    fd.append("message", p.message);
    for (const file of files) fd.append("files", file);
    return fd;
  };
  const res = await stableMultipartFetch({
    input: `${API_URL}/support/tickets`,
    method: "POST",
    files: p.files,
    buildBody: build,
  });
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))).detail;
    throw new Error(detail || "Не удалось создать обращение");
  }
  const data = (await res.json()) as ApiTicketDetail;
  return mapTicketDetail(data);
}

export interface ReplyPayload {
  text: string;
  files: File[];
}

export async function replyToTicket(
  ticketId: number,
  p: ReplyPayload,
): Promise<SupportTicket> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("text", p.text);
    for (const file of files) fd.append("files", file);
    return fd;
  };
  const res = await stableMultipartFetch({
    input: `${API_URL}/support/tickets/${ticketId}/messages`,
    method: "POST",
    files: p.files,
    buildBody: build,
  });
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))).detail;
    throw new Error(detail || "Не удалось отправить сообщение");
  }
  const data = (await res.json()) as ApiTicketDetail;
  return mapTicketDetail(data);
}
