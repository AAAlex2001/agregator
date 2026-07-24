import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./RtnCard.module.scss";
import skeleton from "./RtnCardSkeleton.module.scss";

export function RtnCardSkeleton() {
  return (
    <li className={s.card} aria-hidden="true">
      <div className={s.link}>
        <div className={s.top}>
          <Skeleton className={skeleton.docType} rounded="pill" />
          <Skeleton className={skeleton.status} rounded="pill" />
        </div>
        <Skeleton className={skeleton.titleLine} rounded="md" />
        <Skeleton className={skeleton.titleLineShort} rounded="md" />
        <Skeleton className={skeleton.excerptLine} rounded="sm" />
        <Skeleton className={skeleton.excerptLineShort} rounded="sm" />
        <Skeleton className={skeleton.meta} rounded="pill" />
      </div>
    </li>
  );
}
