import { Screen } from "@/widgets/app-shell";
import { EditEmail } from "@/features/edit-profile";

export function EditEmailPage() {
  return (
    <Screen bare heading="Смена почты" panel>
      <EditEmail />
    </Screen>
  );
}
