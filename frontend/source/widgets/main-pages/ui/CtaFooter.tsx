import styles from "./cta-footer.module.scss";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { BulletIcon } from "@/source/shared/ui/icons";

const CtaFooter = () => {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.cta}>
        <div className={styles.ctaCard}>
            <div className={styles.backgroundImage}>
        <Image src="/belaz_3.svg" alt="Industry background" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageBelAz}>
        <Image src="/belaz_2.svg" alt="Belaz" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageCoal}>
              <Image src="/gold.svg" alt="gold" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal}>
              <Image src="/copper.svg" alt="cooper" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageCoal}>
              <Image src="/gold.svg" alt="gold" fill style={{ objectFit: "contain" }} />
            </div>

            <div className={styles.backgroundImageCoal2}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageCoal2}>
              <Image src="/gold.svg" alt="gold" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal2}>
              <Image src="/copper.svg" alt="cooper" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal2}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>
            <div className={styles.backgroundImageCoal2}>
              <Image src="/gold.svg" alt="gold" fill style={{ objectFit: "contain" }} />
            </div>
          <div className={styles.ctaLeft}>
            <span className={styles.ctaChip}>Действуйте прямо сейчас</span>
            <h1>Найдите эксперта по промышленной безопасности или заявите о своей специализации</h1>
          </div>
          <div className={styles.ctaRight}>
            <h2>После регистрации вы сможете:</h2>
            <ul>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <BulletIcon />
                </span>
                <span className={styles.liText}>Разместить заказ и получить первые отклики уже сегодня — не теряйте время на долгий поиск</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <BulletIcon />
                </span>
                <span className={styles.liText}>Находить проекты именно по вашей аттестации — удобная система фильтрации поиска заказов</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <BulletIcon />
                </span>
                <span className={styles.liText}>Вести переговоры напрямую без посредников</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <BulletIcon />
                </span>
                <span className={styles.liText}>Строить долгосрочную репутацию в профессиональном обществе</span>
              </li>
            </ul>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="sm" fullWidth>
                Найти эксперта
              </Button>
              <Button variant="secondary" size="sm" fullWidth>
                Стать экспертом на платформе
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CtaFooter;
