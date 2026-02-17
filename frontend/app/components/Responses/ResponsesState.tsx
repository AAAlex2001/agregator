import { Title, Subtitle } from "../Typography";

interface ResponsesStateProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  styles: Readonly<Record<string, string>>;
}

export default function ResponsesState({ title, subtitle, action, styles }: ResponsesStateProps) {
  return (
    <div className={styles.statusState}>
      <Title text={title} className={styles.statusTitle} as="h2" />
      <Subtitle text={subtitle} className={styles.statusSubtitle} />
      {action}
    </div>
  );
}
