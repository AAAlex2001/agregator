import styles from "./typography.module.scss";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const Title = ({ children, className = "", as: Tag = "h1" }: TitleProps) => {
  return (
    <Tag className={`${styles.title} ${className}`}>
      {children}
    </Tag>
  );
};

export default Title;
