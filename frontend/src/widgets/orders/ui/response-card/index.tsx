import type { ReactNode } from "react";
import { ExpertInfo } from "@/entities/expert";
import { OrderRequirements } from "@/entities/order";
import { getResponseCost, getResponseStatusBadge, ResponseFiles } from "@/entities/response";
import type { ResponseItem, ResponseViewer } from "@/entities/response";
import { ListCard } from "@/shared/ui/list-card";
import { OrderQuestions } from "../order-questions";
import { ResponseDetails } from "../response-details";
import styles from "./style.module.scss";

/** Отклик, сторона просмотра и доступные ей действия. */
interface ResponseCardProps {
  response: ResponseItem;
  viewer: ResponseViewer;
  actions?: ReactNode;
}

/** Показывает предложение исполнителя рядом с условиями заказа. */
export function ResponseCard({ response, viewer, actions }: ResponseCardProps) {
  const isExpert = viewer === "EXPERT";
  const status = getResponseStatusBadge(response, viewer);
  const isSelectedByCustomer = isExpert
    && response.status === "IN_PROGRESS"
    && !response.expert_confirmed;

  return (
    <ListCard
      meta={`№ ${response.order_id}`}
      statusText={status.text}
      statusColor={status.color}
      statusBg={status.background}
      titleLabel="Название заказа:"
      title={response.order_title}
      headerExtra={isSelectedByCustomer ? (
        <span
          className={styles.selected}
          role="status"
          aria-live="polite"
        >
          Заказчик выбрал вас!
        </span>
      ) : undefined}
      leftExtra={
        <OrderRequirements
          workType="EXPERTISE"
          badges={response.badges}
        />
      }
      bottomLeftCustom={isExpert ? (
        <>
          <span className={styles.label}>Организатор:</span>
          <span className={styles.value}>
            {response.customer_company || response.customer_name || "—"}
          </span>
          {response.customer_inn && (
            <>
              <span className={styles.label}>ИНН</span>
              <span className={styles.value}>{response.customer_inn}</span>
            </>
          )}
        </>
      ) : (
        <div className={styles.expertBlock}>
          <span className={styles.label}>Исполнитель:</span>
          {response.expert_name ? (
            <ExpertInfo
              name={response.expert_name}
              avatarUrl={response.expert_avatar_url}
              rating={response.expert_rating}
              reviewCount={response.expert_review_count}
              expertPublicId={response.expert_public_id}
              companyName={response.expert_company_name}
              inn={response.expert_inn}
            />
          ) : (
            <span className={styles.value}>—</span>
          )}
        </div>
      )}
      rightItems={[
        {
          label: "Начальная максимальная цена",
          value: response.order_sum || "Не установлена",
          valueAccent: true,
        },
        {
          label: isExpert ? "Ваша цена" : "Цена исполнителя",
          value: getResponseCost(response) || "—",
        },
        {
          label: "Срок начала выполнения работ (заказчик)",
          value: response.order_start_date,
        },
        {
          label: "Срок окончания выполнения работ (заказчик)",
          value: response.order_date || "—",
        },
        {
          label: isExpert
            ? "Ваш срок начала выполнения работ"
            : "Срок начала выполнения работ исполнителя",
          value: response.proposed_start_date,
        },
        {
          label: isExpert
            ? "Ваш срок окончания выполнения работ"
            : "Срок окончания выполнения работ исполнителя",
          value: response.proposed_deadline || "—",
        },
        {
          label: "Дата отклика",
          value: response.date || "—",
        },
        {
          label: "Файлы отклика",
          value: response.response_files.length > 0 && (
            <ResponseFiles files={response.response_files} />
          ),
        },
      ].filter((item) => item.value)}
      actions={actions}
      details={
        <ResponseDetails
          response={response}
          viewer={viewer}
        />
      }
      footer={
        <OrderQuestions
          orderId={response.order_id}
          customerId={response.order_customer_id}
          canAsk={false}
        />
      }
    />
  );
}
