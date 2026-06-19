"use client";

import { ReactNode } from "react";
import Image from "next/image";
import styles from "./card.module.scss";
import { ChevronIcon } from "@/source/shared/ui/icons";

type CardVariant = "review" | "industry" | "advantage" | "order";

interface CardProps {
  variant: CardVariant;
  title?: string;
  description?: string | string[];
  price?: string;
  photo?: string;
  icon?: string | ReactNode;
  reviewer?: string;
  position?: string;
  text?: string;
  isActive?: boolean;
  isOpen?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
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
  icon,
  reviewer,
  position,
  text,
  isActive = false,
  isOpen = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: CardProps) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    isActive ? styles.active : "",
    isOpen ? styles.cardOpen : "",
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

  // Advantage card
  if (variant === "advantage") {
    return (
      <article
        className={cardClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {photo && (
          <div className={`${styles.image} ${isOpen ? styles.visible : ""}`}>
            <Image src={photo} alt={title || ""} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.header}>
            {icon && (typeof icon === "string" ? (
              <Image src={icon} alt={title || ""} width={40} height={40} />
            ) : (
              icon
            ))}
            <h3>{title}</h3>
            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
              <ChevronIcon />
            </span>
          </div>
          <div className={`${styles.descriptionWrapper} ${isOpen ? styles.descriptionOpen : ""}`}>
            <p>{typeof description === "string" ? description : ""}</p>
          </div>
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
