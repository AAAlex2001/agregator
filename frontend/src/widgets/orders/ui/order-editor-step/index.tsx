"use client";

import {
  OrderCommentField,
  OrderFilesField,
  OrderMainFields,
  OrderRequirementsField,
  OrderWorkTypeField,
  useOrderForm,
  useOrderFormSteps,
} from "@/entities/order";
import { OrderBadgesField } from "../order-badges-field";
import { OrderCopyOffer } from "../order-copy-offer";
import { OrderDirectionFields } from "../order-direction-fields";
import { OrderEditorPreview } from "../order-editor-preview";
import { OrderExpertsMap } from "../order-experts-map";
import styles from "./style.module.scss";

/** Направления заказчика, справка по кодам и копирование заявки. */
interface OrderEditorStepProps {
  directions: string[];
  onShowHelp: () => void;
  onCopy: () => void;
}

/** Поля текущего шага заказа. */
export function OrderEditorStep({ directions, onShowHelp, onCopy }: OrderEditorStepProps) {
  const { values } = useOrderForm();
  const steps = useOrderFormSteps();
  const isExpertise = values.workType === "EXPERTISE";

  switch (steps.current) {
    case "work":
      return (
        <>
          <OrderCopyOffer onCopy={onCopy} />
          <OrderWorkTypeField directions={directions} />
          {isExpertise && <OrderRequirementsField />}
        </>
      );
    case "main":
      return <OrderMainFields />;
    case "details":
      return isExpertise ? <OrderBadgesField onShowHelp={onShowHelp} /> : <OrderDirectionFields />;
    case "experts":
      return <OrderExpertsMap />;
    case "documents":
      return <OrderFilesField />;
    case "comment":
      return (
        <>
          <OrderCommentField />
          <div className={styles.previewInline}>
            <OrderEditorPreview />
          </div>
        </>
      );
  }
}