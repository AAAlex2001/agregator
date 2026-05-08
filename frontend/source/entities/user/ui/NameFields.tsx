import { TextInput } from "@/source/shared/ui/Inputs";

interface Props {
  firstName: string;
  lastName: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
}

export function NameFields({ firstName, lastName, onChangeFirstName, onChangeLastName }: Props) {
  return (
    <>
      <TextInput
        id="lastName"
        name="profile-last-name"
        placeholder="Фамилия"
        aria-label="Фамилия"
        autoComplete="off"
        value={lastName}
        onChange={(e) => onChangeLastName(e.target.value)}
      />
      <TextInput
        id="firstName"
        name="profile-first-name"
        placeholder="Имя"
        aria-label="Имя"
        autoComplete="off"
        value={firstName}
        onChange={(e) => onChangeFirstName(e.target.value)}
      />
    </>
  );
}
