import { Button, Card, CodeInput, CODE_LENGTH, FullSheet, SheetHero, SuccessModal, TextField } from "@/shared/ui";
import { PHONE_PLACEHOLDER, formatPhone } from "@/shared/lib/phone";
import { useEditProfile } from "../model/use-edit-profile";
import type { EditProfileKind } from "../model/types";
import s from "./edit-profile-sheet.module.scss";

const META: Record<EditProfileKind, { image: string; title: string; desc: string; success: string }> = {
  name: { image: "change-fio", title: "Имя и фамилия", desc: "Как к вам обращаться", success: "Имя обновлено" },
  phone: { image: "change-telephone", title: "Телефон", desc: "Контакт для связи с вами", success: "Телефон обновлён" },
  email: { image: "change-mail", title: "Смена почты", desc: "Подтвердите новую почту кодом", success: "Почта обновлена" },
};

interface Props {
  kind: EditProfileKind | null;
  onClose: () => void;
}

export function EditProfileSheet({ kind, onClose }: Props) {
  const form = useEditProfile(kind);
  const meta = kind ? META[kind] : null;

  const buttonText =
    kind === "email" ? (form.state.stage === "email" ? "Отправить код" : "Подтвердить") : "Сохранить";

  return (
    <FullSheet
      open={kind !== null}
      onClose={onClose}
      hero={
        meta && (
          <SheetHero
            light={`/profile-hero/${meta.image}-light.webp`}
            dark={`/profile-hero/${meta.image}-dark.webp`}
            title={meta.title}
            desc={meta.desc}
            onClose={onClose}
          />
        )
      }
    >
      {kind && meta && (
        <div className={s.body}>
          {kind === "name" && (
            <Card className={s.fields}>
              <TextField
                label="Ваше имя"
                placeholder="Имя"
                value={form.state.first}
                onChange={(e) => form.dispatch({ type: "first", value: e.target.value })}
              />
              <TextField
                label="Ваша фамилия"
                placeholder="Фамилия"
                value={form.state.last}
                onChange={(e) => form.dispatch({ type: "last", value: e.target.value })}
              />
            </Card>
          )}

          {kind === "phone" && (
            <Card className={s.fields}>
              <TextField
                label="Ваш телефон"
                placeholder={PHONE_PLACEHOLDER}
                inputMode="tel"
                value={form.state.phone}
                onChange={(e) => form.dispatch({ type: "phone", value: formatPhone(e.target.value) })}
              />
            </Card>
          )}

          {kind === "email" && form.state.stage === "email" && (
            <>
              <Card className={s.fields}>
                <TextField
                  label="Ваша почта"
                  placeholder="Новая почта"
                  type="email"
                  inputMode="email"
                  value={form.state.email}
                  onChange={(e) => form.dispatch({ type: "email", value: e.target.value })}
                />
              </Card>
              <p className={s.hint}>На новый адрес придёт код подтверждения.</p>
            </>
          )}

          {kind === "email" && form.state.stage === "code" && (
            <>
              <p className={s.codeLab}>Код из письма</p>
              <CodeInput
                length={CODE_LENGTH}
                value={form.state.code}
                onChange={(value) => form.dispatch({ type: "code", value })}
              />
              <p className={s.hint}>Код отправлен на {form.state.email}.</p>
            </>
          )}

          <Button
            className={s.save}
            loading={form.state.busy}
            disabled={!form.canSubmit}
            onClick={() => void form.submit()}
          >
            {buttonText}
          </Button>

          <SuccessModal open={form.state.done} title="Готово!" subtitle={meta.success} onClose={onClose} />
        </div>
      )}
    </FullSheet>
  );
}
