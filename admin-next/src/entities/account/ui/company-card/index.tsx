import { formatDate } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import Message from "@/shared/ui/message";
import Panel from "@/shared/ui/panel";
import { COMPANY_STATUS_LABELS, type Company } from "../../model/types";
import styles from "./style.module.scss";

type CompanyCardProps = {
  company: Company | null;
};

/** Карточка компании из DaData: название, реквизиты, статус, руководитель, адрес и ОКВЭД. */
const CompanyCard = ({ company }: CompanyCardProps) => {
  if (!company) {
    return (
      <Panel title="Компания">
        <Message>Карточки нет — ИНН не указан или DaData его не нашла.</Message>
      </Panel>
    );
  }

  const rows = [
    ["ИНН", company.inn],
    ["КПП", company.kpp],
    ["ОГРН", company.ogrn],
    ["Дата регистрации", company.registration_date && formatDate(company.registration_date)],
    ["Руководитель", company.manager],
    ["Адрес", company.address],
    ["ОКВЭД", company.okved],
  ].filter(([, value]) => value);

  return (
    <Panel
      title="Компания"
      action={company.status && <Badge tone={company.status === "ACTIVE" ? "success" : "danger"}>{COMPANY_STATUS_LABELS[company.status] ?? company.status}</Badge>}
    >
      <p className={styles.name}>{company.name}</p>

      <dl className={styles.list}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.row}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default CompanyCard;
