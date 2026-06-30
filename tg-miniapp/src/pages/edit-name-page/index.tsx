import { Screen } from "@/widgets/app-shell";
import { EditName } from "@/features/edit-profile";

export function EditNamePage() {
  return (
    <Screen bare heading="Имя и фамилия">
      <EditName />
    </Screen>
  );
}
