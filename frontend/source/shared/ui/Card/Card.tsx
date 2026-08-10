"use client";

import Image from "next/image";
import styles from "./card.module.scss";

type CardVariant = "review" | "industry" | "order";

interface CardProps {
  variant: CardVariant;
  title?: string;
  description?: string | string[];
  price?: string;
  photo?: string;
  reviewer?: string;
  position?: string;
  text?: string;
  isActive?: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const Card = ({
  variant,
  title,
  description,
  price,
  photo,
  reviewer,
  position,
  text,
  isActive = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: CardProps) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    isActive ? styles.active : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Review card
  if (variant === "review") {
    return (
      <article className={cardClasses}>
        <p>{text}</p>
        <div className={styles.reviewerInfo}>
          <span className={styles.reviewer}>{reviewer}</span>
          <span className={styles.position}>{position}</span>
        </div>
      </article>
    );
  }

  // Industry card
  if (variant === "industry") {
    return (
      <article
        className={cardClasses}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {photo && (
          <div className={`${styles.image} ${isHovered ? styles.visible : ""}`}>
            <Image src={photo} alt={title || ""} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.header}>
            <h3>{title}</h3>
          </div>
          {Array.isArray(description) && (
            <ul>
              {description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  }

  // Order card
  if (variant === "order") {
    return (
      <article className={cardClasses}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <span>{price}</span>
        </div>
        <p>{typeof description === "string" ? description : ""}</p>
      </article>
    );
  }

  return null;
};

export default Card;
