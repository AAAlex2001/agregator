import { Screen } from "@/widgets/app-shell";
import { EditPhone } from "@/features/edit-profile";

export function EditPhonePage() {
  return (
    <Screen bare heading="Телефон">
      <EditPhone />
    </Screen>
  );
}
