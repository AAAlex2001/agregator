import cn from "classnames";
import s from "./Skeleton.module.scss";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "pill";
}

export default function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  return <span className={cn(s.skeleton, s[rounded], className)} aria-hidden="true" />;
}