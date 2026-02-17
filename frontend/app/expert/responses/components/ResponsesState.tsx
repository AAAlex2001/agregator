import { Title, Subtitle } from "@/app/components";
import styles from "../responses.module.scss";

interface ResponsesStateProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function ResponsesState({ title, subtitle, action }: ResponsesStateProps) {
  return (
    <div className={styles.statusState}>
      <Title text={title} className={styles.statusTitle} as="h2" />
      <Subtitle text={subtitle} className={styles.statusSubtitle} />
      {action}
    </div>
  );
}
