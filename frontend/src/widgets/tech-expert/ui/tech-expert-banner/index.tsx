import Image from "next/image";
import { DocumentsSearch } from "@/features/search-tech-expert-documents";
import styles from "./style.module.scss";

/** Ожидание поиска, его запуск и сброс найденного. */
interface TechExpertBannerProps {
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

/** Синий баннер фонда «Кодекс» со строкой поиска документов. */
export function TechExpertBanner({ isSearching, onSearch, onClear }: TechExpertBannerProps) {
  return (
    <section className={styles.banner}>
      <div
        className={styles.art}
        aria-hidden="true"
      >
        <Image
          className={styles.artImage}
          src="/tech-expert-people.webp"
          alt=""
          fill
          sizes="(max-width: 1439px) 0px, 640px"
        />
      </div>
      <div className={styles.top}>
        <Image
          className={styles.logo}
          src="/codex.png"
          alt="Консорциум КОДЕКС"
          width={364}
          height={182}
        />
        <span
          className={styles.divider}
          aria-hidden="true"
        />
        <div className={styles.text}>
          <span className={styles.title}>Электронный фонд</span>
          <span className={styles.subtitle}>
            более <span className={styles.accent}>100 000 000</span> актуальных правовых и
            нормативно-технических документов
          </span>
        </div>
      </div>

      <DocumentsSearch
        isSearching={isSearching}
        onSearch={onSearch}
        onClear={onClear}
      />
    </section>
  );
}
