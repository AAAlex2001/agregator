import Skeleton from "@/source/shared/ui/Skeleton";
import { ListCard } from "@/source/shared/ui/ListCard";
import s from "./RtnQuestionCardSkeleton.module.scss";

export function RtnQuestionCardSkeleton() {
  return (
    <ListCard
      meta={<Skeleton className={s.meta} rounded="pill" />}
      title={<Skeleton className={s.title} rounded="md" />}
      bottomLeftLabel="Дата отправки"
      bottomLeftValue={<Skeleton className={s.date} rounded="pill" />}
    />
  );
}
