"use client";

import cn from "classnames";
import { directionLabel } from "@/entities/direction";
import { LEAD_STATUS_LABELS, LEAD_STATUS_TONES, type Lead, type LeadStatus } from "@/entities/lead";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import LeadNote from "../lead-note";
import styles from "./style.module.scss";

type LeadsTableProps = {
  leads: Lead[];
  pendingId: number | null;
  noteFor: number | null;
  noteDraft: string;
  onSetStatus: (lead: Lead, status: LeadStatus) => void;
  onOpenNote: (lead: Lead) => void;
  onChangeNote: (value: string) => void;
  onSaveNote: (lead: Lead) => void;
  onCloseNote: () => void;
};

const contactLines = (lead: Lead) =>
  [lead.phone, lead.email, [lead.company, lead.inn && `ИНН ${lead.inn}`].filter(Boolean).join(" · "), lead.region].filter(Boolean);

/** Список заявок: контакты, задача, заметка менеджера и смена статуса в строке. */
const LeadsTable = ({ leads, pendingId, noteFor, noteDraft, onSetStatus, onOpenNote, onChangeNote, onSaveNote, onCloseNote }: LeadsTableProps) => (
  <List>
    {leads.map((lead) => (
      <ListRow key={lead.id} className={cn(styles.row, pendingId === lead.id && styles.pending)}>
        <div className={styles.head}>
          <span className={styles.meta}>
            #{lead.id} · {formatDateTime(lead.created_at)}
          </span>
          <span className={styles.badges}>
            <Badge tone="accent">{directionLabel(lead.direction)}</Badge>
            <Badge tone={LEAD_STATUS_TONES[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
          </span>
        </div>

        <div className={styles.columns}>
          <div className={styles.block}>
            <span className={styles.name}>{lead.name}</span>
            {contactLines(lead).map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
          </div>

          <div className={styles.block}>
            {lead.work_kinds && <span className={styles.name}>{lead.work_kinds}</span>}
            <span className={styles.task}>{lead.task}</span>
            {lead.object_name && <span className={styles.line}>Объект: {lead.object_name}</span>}
            {(lead.deadline || lead.budget) && (
              <span className={styles.line}>{[lead.deadline && `Срок: ${lead.deadline}`, lead.budget && `Бюджет: ${lead.budget}`].filter(Boolean).join(" · ")}</span>
            )}
            {lead.source_url && (
              <a className={styles.source} href={lead.source_url} target="_blank" rel="noopener noreferrer">
                Страница обращения
              </a>
            )}
          </div>
        </div>

        <LeadNote
          comment={lead.comment}
          editing={noteFor === lead.id}
          draft={noteDraft}
          onOpen={() => onOpenNote(lead)}
          onChange={onChangeNote}
          onSave={() => onSaveNote(lead)}
          onClose={onCloseNote}
        />

        {lead.status !== "DONE" && lead.status !== "SPAM" && (
          <div className={styles.actions}>
            {lead.status === "NEW" && (
              <Button variant="outline" size="sm" onClick={() => onSetStatus(lead, "IN_WORK")}>
                В работу
              </Button>
            )}
            <Button size="sm" onClick={() => onSetStatus(lead, "DONE")}>
              Обработана
            </Button>
            <Button variant="danger" size="sm" onClick={() => onSetStatus(lead, "SPAM")}>
              Спам
            </Button>
          </div>
        )}
      </ListRow>
    ))}
  </List>
);

export default LeadsTable;
