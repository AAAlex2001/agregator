import { EmptyState } from "@/source/shared/ui/EmptyState";
import { TabSupportIcon } from "@/source/shared/ui/icons";

interface EmptyDetailProps {
  onCreate: () => void;
}

/** Центр страницы поддержки, пока обращение не выбрано. */
export function EmptyDetail({ onCreate }: EmptyDetailProps) {
  return (
    <EmptyState
      icon={<TabSupportIcon />}
      title="Выберите обращение"
      subtitle="Здесь появится переписка с поддержкой. Выберите обращение в списке или создайте новое."
      actionLabel="Создать обращение"
      onAction={onCreate}
    />
  );
}
