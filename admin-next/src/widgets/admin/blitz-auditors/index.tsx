"use client";

import { useBlitzAuditors } from "@/features/blitz-admin";
import { BLITZ_PATH } from "@/shared/lib/admin-paths";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import styles from "./style.module.scss";

/** Аудиторы СУПБ: кто руководит группами, берёт заявки на аудит и составляет План. */
const BlitzAuditors = () => {
  const { auditors, error, pendingId, toggleLead } = useBlitzAuditors();

  return (
    <Page>
      <PageHeader
        backHref={BLITZ_PATH}
        title="Аудиторы СУПБ"
        description="Эксперты с анкетой «Аудит СУПБ». Руководители групп получают новые заявки на аудит"
      />
      {error && <Message tone="error">{error}</Message>}
      {!auditors && !error && <Loader size="lg" />}
      {auditors?.length === 0 && <Message>Экспертов с анкетой аудитора пока нет.</Message>}
      {auditors && auditors.length > 0 && (
        <List>
          {auditors.map((auditor) => (
            <ListRow key={auditor.id}>
              <span className={styles.subject}>
                <span className={styles.name}>{auditor.name}</span>
                <span className={styles.areas}>{auditor.areas.join(", ") || "Области не указаны"}</span>
              </span>
              <span className={styles.status}>
                {auditor.lead && <Badge tone="success">Руководитель группы</Badge>}
              </span>
              <Button
                variant={auditor.lead ? "outline" : "primary"}
                loading={pendingId === auditor.id}
                disabled={pendingId !== null && pendingId !== auditor.id}
                onClick={() => void toggleLead(auditor)}
              >
                {auditor.lead ? "Снять" : "Назначить руководителем"}
              </Button>
            </ListRow>
          ))}
        </List>
      )}
    </Page>
  );
};

export default BlitzAuditors;