import styles from "./typography.module.scss";

interface SubtitleProps {
  text?: string;
  className?: string;
}

const Subtitle = ({ text, className = "" }: SubtitleProps) => {
  return (
    <p className={`${styles.subtitle} ${className}`}>
      {text}
    </p>
  );
};

export default Subtitle;
