import s from "./Skeleton.module.scss";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "pill";
}

export default function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  return <span className={[s.skeleton, s[rounded], className].filter(Boolean).join(" ")} aria-hidden="true" />;
}