import type { AccountChanges } from "@/entities/account";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

type AccountFormProps = {
  fields: AccountChanges;
  pending: boolean;
  onChange: (fields: AccountChanges) => void;
  onSubmit: () => void;
};

/** Форма профиля: имя, контакты, ИНН, подтверждение email и доступ к площадке. */
const AccountForm = ({ fields, pending, onChange, onSubmit }: AccountFormProps) => (
  <form
    className={styles.form}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Panel title="Профиль">
      <FieldGrid>
        <Field label="Имя">
          <Input
            ariaLabel="Имя"
            maxLength={100}
            value={fields.first_name}
            onChange={(first_name) => onChange({ ...fields, first_name })}
          />
        </Field>

        <Field label="Фамилия">
          <Input
            ariaLabel="Фамилия"
            maxLength={100}
            value={fields.last_name}
            onChange={(last_name) => onChange({ ...fields, last_name })}
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            ariaLabel="Email"
            maxLength={255}
            value={fields.email}
            onChange={(email) => onChange({ ...fields, email })}
          />
        </Field>

        <Field label="Телефон">
          <Input ariaLabel="Телефон" maxLength={50} value={fields.phone} onChange={(phone) => onChange({ ...fields, phone })} />
        </Field>

        <Field label="ИНН" hint="При смене ИНН карточка компании обновится из DaData">
          <Input ariaLabel="ИНН" maxLength={12} value={fields.inn} onChange={(inn) => onChange({ ...fields, inn })} />
        </Field>
      </FieldGrid>

      <div className={styles.flags}>
        <Checkbox checked={fields.email_verified} onChange={(email_verified) => onChange({ ...fields, email_verified })}>
          Email подтверждён
        </Checkbox>
        <Checkbox checked={fields.is_active} onChange={(is_active) => onChange({ ...fields, is_active })}>
          Доступ к площадке открыт
        </Checkbox>
      </div>
    </Panel>

    <Button className={styles.submit} type="submit" loading={pending} disabled={!fields.email.trim() && !fields.phone.trim()}>
      Сохранить
    </Button>
  </form>
);

export default AccountForm;
