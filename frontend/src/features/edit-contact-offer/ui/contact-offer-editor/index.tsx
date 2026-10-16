import { ExpertContactOfferFields } from "@/entities/expert-contact";
import type { ExpertContactOffer } from "@/entities/expert-contact";
import { Button } from "@/shared/ui/button";
import { useEditContactOffer } from "../../model/use-edit-contact-offer";
import styles from "./style.module.scss";

/** Условия контактов, загруженные для редактируемого аккаунта. */
interface ContactOfferEditorProps {
  initialOffer: ExpertContactOffer;
}

/** Редактирует загруженные условия и подтверждает их отдельной кнопкой. */
export function ContactOfferEditor({ initialOffer }: ContactOfferEditorProps) {
  const { fields, isSaving, change, save } = useEditContactOffer(
    initialOffer,
    "Настройки контактов сохранены",
  );

  return (
    <div className={styles.body}>
      <ExpertContactOfferFields
        idPrefix="profile"
        withHeading={false}
        value={fields}
        onChange={change}
      />

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={isSaving}
        onClick={save}
      >
        Сохранить
      </Button>
    </div>
  );
}

