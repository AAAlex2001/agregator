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
import { FormSection } from "@/shared/ui/form-section";
import { OrderBadgesField } from "../order-badges-field";
import { OrderCopyOffer } from "../order-copy-offer";
import { OrderDirectionFields } from "../order-direction-fields";
import { OrderEditorPreview } from "../order-editor-preview";
import { OrderExpertsMap } from "../order-experts-map";

/** Направления заказчика, справка по кодам и копирование заявки. */
interface OrderEditorStepProps {
  directions: string[];
  onShowHelp: () => void;
  onCopy: () => void;
}

/** Разделы текущего шага заказа. */
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
      return <OrderCommentField />;
    case "preview":
      return (
        <FormSection
          title="Как увидят исполнители"
          hint="Так заказ будет выглядеть в ленте. Если что-то не так — вернитесь к нужному шагу"
        >
          <OrderEditorPreview />
        </FormSection>
      );
  }
}
