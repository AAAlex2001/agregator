import { TextInput } from "@/shared/ui/text-input";

/** Имя и фамилия вместе с независимыми действиями редактирования. */
interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
}

/** Показывает имя и фамилию регистрирующегося пользователя. */
export function NameFields({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: NameFieldsProps) {
  return (
    <>
      <TextInput
        id="register-last-name"
        value={lastName}
        autoComplete="off"
        onChange={(event) => onLastNameChange(event.target.value)}
        placeholder="Фамилия"
      />
      <TextInput
        id="register-first-name"
        value={firstName}
        autoComplete="off"
        onChange={(event) => onFirstNameChange(event.target.value)}
        placeholder="Имя"
      />
    </>
  );
}
