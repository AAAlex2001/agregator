import { getOrderDocumentPaths, OrderComment, OrderDocumentsGallery } from "@/entities/order";
import {
  getConfirmReminder,
  isOrderCommentVisible,
  isResponseCommentVisible,
  ResponseFiles,
} from "@/entities/response";
import type { ResponseItem, ResponseViewer } from "@/entities/response";
import styles from "./style.module.scss";

/** Отклик и сторона, для которой показываются комментарии и напоминания. */
interface ResponseDetailsProps {
  response: ResponseItem;
  viewer: ResponseViewer;
}

/** Комментарии сторон, причина отказа, файлы отклика и документы заказа. */
export function ResponseDetails({ response, viewer }: ResponseDetailsProps) {
  const organization = response.expert_inn
    ? `${response.expert_company_name} (ИНН ${response.expert_inn})`
    : response.expert_company_name;
  const reminder = getConfirmReminder(response, viewer);
  const hasDocuments = getOrderDocumentPaths(response.order_documents).length > 0;

  return (
    <>
      {response.expert_company_name && (
        <OrderComment
          title="Организация исполнителя:"
          text={organization}
        />
      )}
      {isResponseCommentVisible(response, viewer) && response.comment && (
        <OrderComment
          title="Комментарий:"
          text={response.comment}
          previous={response.previous_comment}
        />
      )}
      {isOrderCommentVisible(response, viewer) && response.order_comment && (
        <OrderComment
          text={response.order_comment}
          previous={response.order_previous_comment}
        />
      )}
      {response.status === "REJECTED" && response.rejection_reason && (
        <div className={styles.rejection}>
          <span className={styles.rejectionTitle}>Причина отказа:</span>
          <span className={styles.rejectionText}>{response.rejection_reason}</span>
        </div>
      )}
      {response.response_files.length > 0 && (
        <ResponseFiles
          title="Файлы отклика:"
          files={response.response_files}
          previousFiles={response.previous_response_files}
        />
      )}
      {hasDocuments && <OrderDocumentsGallery documents={response.order_documents} />}
      {reminder && <span className={styles.reminder}>{reminder}</span>}
    </>
  );
}
