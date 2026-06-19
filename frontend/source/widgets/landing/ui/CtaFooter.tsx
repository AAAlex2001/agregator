import s from "./cta-footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { BulletIcon } from "@/source/shared/ui/icons";

const CtaFooter = () => {
  return (
    <section className={s.footer} id="cta">
      <div className={s.cta}>
        <div className={s.ctaCard}>
            <div className={s.backgroundImage}>
        <Image src="/belaz_3.webp" alt="" aria-hidden="true" fill sizes="354px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageBelAz}>
        <Image src="/belaz_2.webp" alt="" aria-hidden="true" fill sizes="672px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
        <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/gold.webp" alt="" aria-hidden="true" fill sizes="486px" style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/copper.webp" alt="" aria-hidden="true" fill sizes="390px" style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal}>
        <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/gold.webp" alt="" aria-hidden="true" fill sizes="486px" style={{ objectFit: "contain" }} />
            </div>

            <div className={s.backgroundImageCoal2}>
        <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/gold.webp" alt="" aria-hidden="true" fill sizes="486px" style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/copper.webp" alt="" aria-hidden="true" fill sizes="390px" style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal2}>
        <Image src="/coal.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
      </div>
            <div className={s.backgroundImageCoal2}>
              <Image src="/gold.webp" alt="" aria-hidden="true" fill sizes="486px" style={{ objectFit: "contain" }} />
            </div>
          <div className={s.ctaLeft}>
            <Link href="/register" className={s.ctaChip}>Действуйте прямо сейчас</Link>
            <h2>Найдите эксперта по промышленной безопасности или заявите о своей специализации</h2>
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
              <Button href="/register" variant="primary" size="sm" fullWidth>
                Найти эксперта
              </Button>
              <Button href="/register" variant="secondary" size="sm" fullWidth>
                Стать экспертом на платформе
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaFooter;
