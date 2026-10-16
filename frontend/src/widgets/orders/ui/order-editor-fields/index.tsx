"use client";

import {
  OrderCommentField,
  OrderFilesField,
  OrderMainFields,
  OrderRequirementsField,
  OrderWorkTypeField,
  useOrderForm,
} from "@/entities/order";
import { Title } from "@/shared/ui/title";
import { OrderBadgesField } from "../order-badges-field";
import { OrderDirectionFields } from "../order-direction-fields";
import { OrderEditorPreview } from "../order-editor-preview";
import { OrderExpertsMap } from "../order-experts-map";
import styles from "./style.module.scss";

/** Направления заказчика, необязательный заголовок и открытие справки. */
interface OrderEditorFieldsProps {
  directions: string[];
  title?: string;
  onShowHelp: () => void;
}

/** Собирает условия, карту и документы заказа в прежнем порядке формы. */
export function OrderEditorFields({
  directions,
  title,
  onShowHelp,
}: OrderEditorFieldsProps) {
  const { values } = useOrderForm();
  const isExpertise = values.workType === "EXPERTISE";

  return (
    <>
      {title && (
        <Title
          className={styles.title}
          text={title}
        />
      )}
      <OrderMainFields />
      <OrderWorkTypeField directions={directions} />
      {isExpertise && <OrderRequirementsField />}
      {values.details && <OrderDirectionFields />}
      <OrderExpertsMap />
      {isExpertise && <OrderBadgesField onShowHelp={onShowHelp} />}
      <OrderCommentField />
      <OrderFilesField />
      <div className={styles.previewInline}>
        <OrderEditorPreview />
      </div>
    </>
  );
}
