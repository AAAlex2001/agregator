import type { ReactNode } from "react";
import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./DirectionCard.module.scss";

interface DirectionCardProps {
  isLoading: boolean;
  loadError: string | null;
  isSaving: boolean;
  onSave: () => void;
  children: ReactNode;
}

/** Обёртка анкеты направления: ошибка или скелетон, пока анкета не загрузилась, затем поля и кнопка «Сохранить анкету». */
export function DirectionCard({ isLoading, loadError, isSaving, onSave, children }: DirectionCardProps) {
  if (loadError) return <p className={s.error} role="alert">{loadError}</p>;
  if (isLoading) return <Skeleton className={s.skeleton} rounded="md" />;

  return (
    <div className={s.card}>
      {children}
      <Button variant="chat" size="md" fullWidth isLoading={isSaving} onClick={onSave}>
        Сохранить анкету
      </Button>
    </div>
  );
}
