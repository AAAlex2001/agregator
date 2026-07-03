import { type TextareaHTMLAttributes } from "react";
import cn from "classnames";
import s from "./style.module.scss";

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(s.textarea, className)} {...rest} />;
}
