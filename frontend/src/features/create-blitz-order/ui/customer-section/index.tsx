"use client";

import { BlitzFilePicker } from "@/entities/blitz-order";
import type { BlitzCustomerType } from "@/entities/blitz-order";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { FormSection } from "@/shared/ui/form-section";
import { Tabs } from "@/shared/ui/tabs";
import { CUSTOMER_TYPE_TABS } from "../../config/options";
import type { CompanyField, CreateBlitzOrderState, IndividualField } from "../../model/types";
import { CompanyFields } from "../company-fields";
import { IndividualFields } from "../individual-fields";

/** Типы заказчика в порядке вкладок. */
const CUSTOMER_TYPES: BlitzCustomerType[] = ["legal", "entrepreneur", "individual"];

/** Черновик, карточка организации и изменения данных заказчика. */
interface CustomerSectionProps {
  state: CreateBlitzOrderState;
  cardItems: FileGalleryItem[];
  isCardChosen: boolean;
  onTypeChange: (customerType: BlitzCustomerType) => void;
  onCompanyChange: (field: CompanyField, value: string) => void;
  onIndividualChange: (field: IndividualField, value: string) => void;
  onCardAdd: (files: FileList | null) => void;
}

/** Заказчик: организация и ИП платят по счёту, физлицо — картой. */
export function CustomerSection({
  state,
  cardItems,
  isCardChosen,
  onTypeChange,
  onCompanyChange,
  onIndividualChange,
  onCardAdd,
}: CustomerSectionProps) {
  const isIndividual = state.customerType === "individual";

  return (
    <FormSection
      title="Заказчик"
      hint={isIndividual ? "Физлицо оплачивает картой" : "Организация и ИП оплачивают по счёту"}
    >
      <Tabs
        tabs={CUSTOMER_TYPE_TABS}
        activeTab={state.customerType}
        onTabChange={(id) => onTypeChange(CUSTOMER_TYPES.find((item) => item === id) ?? "legal")}
      />
      {isIndividual ? (
        <IndividualFields
          individual={state.individual}
          onChange={onIndividualChange}
        />
      ) : (
        <>
          <CompanyFields
            company={state.company}
            onChange={onCompanyChange}
          />
          <BlitzFilePicker
            label="Карточка организации (необязательно)"
            hint="Если приложите карточку, эксперту проще сверить реквизиты"
            items={cardItems}
            isFull={isCardChosen}
            multiple={false}
            onAdd={onCardAdd}
          />
        </>
      )}
    </FormSection>
  );
}
