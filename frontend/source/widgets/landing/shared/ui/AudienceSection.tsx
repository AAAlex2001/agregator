import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { Title } from "@/source/shared/ui/Typography";
import s from "./audience-section.module.scss";

export interface AudienceBlock {
  audience: string;
  title: string;
  items: string[];
  image: string;
  imageAlt: string;
  link?: { label: string; href: string };
}

interface AudienceSectionProps {
  blocks: AudienceBlock[];
}

export function AudienceSection({ blocks }: AudienceSectionProps) {
  return (
    <section className={s.section}>
      <div className={s.content}>
        {blocks.map((block, index) => (
          <article
            key={block.audience}
            className={`${s.row} ${index % 2 === 1 ? s.rowReversed : ""}`.trim()}
          >
            <div className={s.text}>
              <span className={s.badge}>{block.audience}</span>
              <Title as="h2" className={s.title} text={block.title} />
              <ul className={s.list}>
                {block.items.map((item) => (
                  <li key={item} className={s.item}>
                    {item}
                  </li>
                ))}
              </ul>
              {block.link && (
                <Button
                  href={block.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  showArrow
                  className={s.link}
                >
                  {block.link.label}
                </Button>
              )}
            </div>

            <div className={s.media}>
              <Image
                src={block.image}
                alt={block.imageAlt}
                width={640}
                height={480}
                className={s.image}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
