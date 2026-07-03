import { BottomSheet } from "@/shared/ui";
import { EditName } from "./edit-name";
import { EditPhone } from "./edit-phone";
import { EditEmail } from "./edit-email";

export type EditProfileKind = "name" | "phone" | "email";

const TITLE: Record<EditProfileKind, string> = {
  name: "Имя и фамилия",
  phone: "Телефон",
  email: "Смена почты",
};

interface Props {
  kind: EditProfileKind | null;
  onClose: () => void;
}

export function EditProfileSheet({ kind, onClose }: Props) {
  return (
    <BottomSheet open={kind !== null} full title={kind ? TITLE[kind] : undefined} onClose={onClose}>
      {kind === "name" && <EditName onDone={onClose} />}
      {kind === "phone" && <EditPhone onDone={onClose} />}
      {kind === "email" && <EditEmail onDone={onClose} />}
    </BottomSheet>
  );
}
