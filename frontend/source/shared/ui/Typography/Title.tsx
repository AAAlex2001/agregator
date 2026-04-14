import styles from "./typography.module.scss";

interface TitleProps {
  text?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const Title = ({ text, className = "", as: Tag = "h1" }: TitleProps) => {
  return (
    <Tag className={`${styles.title} ${className}`}>
      {text}
    </Tag>
  );
};

export default Title;
