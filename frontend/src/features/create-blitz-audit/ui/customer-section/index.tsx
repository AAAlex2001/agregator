"use client";

import type { Dispatch } from "react";
import { BlitzCompanyFields, BlitzFilePicker } from "@/entities/blitz-order";
import type { BlitzCompany } from "@/entities/blitz-order";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { FormSection } from "@/shared/ui/form-section";
import { Tabs } from "@/shared/ui/tabs";
import { AUDIT_CUSTOMER_TYPES, CUSTOMER_TYPE_TABS } from "../../config/options";
import { pickOne } from "../../model/options";
import type { AuditCustomerType, CreateBlitzAuditAction } from "../../model/types";

/** Тип заказчика, реквизиты, карточка организации и изменения. */
interface CustomerSectionProps {
  customerType: AuditCustomerType;
  company: BlitzCompany;
  cardItems: FileGalleryItem[];
  isCardChosen: boolean;
  onCardAdd: (files: FileList | null) => void;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Реквизиты заказчика для договора, счёта и акта: аудит оплачивается по счёту. */
export function CustomerSection({
  customerType,
  company,
  cardItems,
  isCardChosen,
  onCardAdd,
  dispatch,
}: CustomerSectionProps) {
  return (
    <FormSection
      title="Реквизиты заказчика"
      hint="Аудит заказывает организация или ИП и оплачивает его по счёту"
    >
      <Tabs
        tabs={CUSTOMER_TYPE_TABS}
        activeTab={customerType}
        onTabChange={(id) => {
          const chosen = pickOne(AUDIT_CUSTOMER_TYPES, id);
          if (chosen) {
            dispatch({ type: "customer-type/change", customerType: chosen });
          }
        }}
      />
      <BlitzCompanyFields
        company={company}
        onChange={(field, value) => dispatch({ type: "company/change", field, value })}
      />
      <BlitzFilePicker
        label="Карточка организации (необязательно)"
        hint="Если приложите карточку, аудитору проще сверить реквизиты"
        items={cardItems}
        isFull={isCardChosen}
        multiple={false}
        onAdd={onCardAdd}
      />
    </FormSection>
  );
}