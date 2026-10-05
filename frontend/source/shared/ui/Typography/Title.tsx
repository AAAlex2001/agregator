import styles from "./typography.module.scss";

interface TitleProps {
  id?: string;
  text?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const Title = ({ id, text, className = "", as: Tag = "h2" }: TitleProps) => {
  return (
    <Tag id={id} className={`${styles.title} ${className}`}>
      {text}
    </Tag>
  );
};

export default Title;
