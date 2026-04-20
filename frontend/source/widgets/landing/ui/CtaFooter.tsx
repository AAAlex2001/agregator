import s from "./cta-footer.module.scss";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { BulletIcon } from "@/source/shared/ui/icons";

const CtaFooter = () => {
  return (
    <footer className={s.footer} id="footer">
      <div className={s.cta}>
        <div className={s.ctaCard}>
            <div className={s.backgroundImage}>
        <Image src="/belaz_3.svg" alt="Industry background" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageBelAz}>
        <Image src="/belaz_2.svg" alt="Belaz" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/gold.svg" alt="gold" fill unoptimized style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/copper.svg" alt="cooper" fill unoptimized style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/gold.svg" alt="gold" fill unoptimized style={{ objectFit: "contain" }} />
            </div>

            <div className={s.backgroundImageCoal2}>
        <Image src="/coal.svg" alt="coal" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/gold.svg" alt="gold" fill unoptimized style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/copper.svg" alt="cooper" fill unoptimized style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal2}>
        <Image src="/coal.svg" alt="coal" fill unoptimized style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/gold.svg" alt="gold" fill unoptimized style={{ objectFit: "contain" }} />
            </div>
          <div className={s.ctaLeft}>
            <span className={s.ctaChip}>Действуйте прямо сейчас</span>
            <h1>Найдите эксперта по промышленной безопасности или заявите о своей специализации</h1>
          </div>
          <div className={s.ctaRight}>
            <h2>После регистрации вы сможете:</h2>
            <ul>
              <li>
                <span aria-hidden="true" className={s.bullet}>
                  <BulletIcon />
                </span>
                <span className={s.liText}>Разместить заказ и получить первые отклики уже сегодня — не теряйте время на долгий поиск</span>
              </li>
              <li>
                <span aria-hidden="true" className={s.bullet}>
                  <BulletIcon />
                </span>
                <span className={s.liText}>Находить проекты именно по вашей аттестации — удобная система фильтрации поиска заказов</span>
              </li>
              <li>
                <span aria-hidden="true" className={s.bullet}>
                  <BulletIcon />
                </span>
                <span className={s.liText}>Вести переговоры напрямую без посредников</span>
              </li>
              <li>
                <span aria-hidden="true" className={s.bullet}>
                  <BulletIcon />
                </span>
                <span className={s.liText}>Строить долгосрочную репутацию в профессиональном обществе</span>
              </li>
            </ul>
            <div className={s.ctaActions}>
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
