import styles from "./typography.module.scss";

interface SubtitleProps {
  text?: string;
  className?: string;
}

const Subtitle = ({ text, className = "" }: SubtitleProps) => {
  return (
    <h2 className={`${styles.subtitle} ${className}`}>
      {text}
    </h2>
  );
};

export default Subtitle;
