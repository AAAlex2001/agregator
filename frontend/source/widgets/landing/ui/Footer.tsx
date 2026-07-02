import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/source/shared/ui/icons/LogoIcon";
import s from "./footer.module.scss";

type FooterVariant = "dark" | "light";

type FooterProps = {
  variant?: FooterVariant;
};

const Footer = ({ variant = "dark" }: FooterProps) => {
  const footerClass = variant === "light" ? `${s.footer} ${s.light}` : s.footer;
  return (
    <footer className={footerClass} id="footer">
        <div className={s.content}>
      <div className={s.primary}>
            <div className={s.backgroundImage}>
              <Image src="/belaz_3.webp" alt="" aria-hidden="true" fill sizes="354px" style={{ objectFit: "contain" }} />
            </div>
            <div className={s.backgroundImageCoal}>
              <Image src="/gold.webp" alt="" aria-hidden="true" fill sizes="246px" style={{ objectFit: "contain" }} />
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
          <div className={s.primaryLogo}>
        <span className={s.logo}>
          <LogoIcon title="Ресурс-Плюс" />
        </span>

          <p>Площадка для аттестованных экспертов промышленной безопасности</p>
          </div>
              <div className={s.links}>
                <div>
                  <h2>Платформа</h2>
                  <Link href="/#about">О нас</Link>
                  <Link href="/#advantages">Как это работает</Link>
                  <Link href="/#faq">FAQ</Link>
                  <Link href="/news">Новости отрасли</Link>
                  <Link href="/blog">Блог об экспертизе ОПО</Link>
                </div>
                <div>
                  <h2>Заказчикам</h2>
                  <Link href="/register">Разместить заказ на экспертизу промышленной безопасности</Link>
                  <Link href="/orders">Тендеры на экспертизу ОПО</Link>
                  <Link href="/register">Найти аттестованного эксперта Ростехнадзора</Link>
                </div>
                <div>
                  <h2>Специалистам</h2>
                  <Link href="/register">Найти заказы на экспертизу ПБ</Link>
                  <Link href="/register">Создать профиль эксперта</Link>
                  <Link href="/register">Портфолио и отзывы</Link>
                </div>
                <div>
                  <h2>Документы</h2>
                  <Link href="/requisites">Реквизиты компании</Link>
                  <Link href="/offer">Публичная оферта</Link>
                  <Link href="/user-agreement">Пользовательское соглашение</Link>
                  <Link href="/privacy-policy">Политика конфиденциальности</Link>
                  <Link href="/personal-data-consent">Согласие на обработку ПДн</Link>
                </div>
              </div>

          {/*
          <div className={s.chatBlock}>
          </div>
          */}

      </div>
      <div className={s.bottom}>
        <div className={s.bottomLinks}>
            <span>*Все эксперты имеют аттестацию Ростехнадзора согласно
            <a href="https://www.gosnadzor.ru/service/list/certification%20experts/%D0%9F%D1%80-287%20%D0%BE%D1%82%2031.08.2022.pdf?ysclid=mi265psds810889564"
               target="_blank"
               rel="noopener noreferrer"
               title="Открыть Приказ № 287 от 31.08.2022 г.">
            Приказу № 287 от 31.08.2022 г.
            </a>
            </span>
            {/*
            <div className={s.bottomLinksButtoms}>
          <Link href="/user-agreement"><p>Пользовательское соглашение</p></Link>
          <p>Политика конфиденциальности</p>
          <p>Политика обработки данных</p>
                </div>
            */}
        </div>
          <span>© {new Date().getFullYear()} ООО «НПИ «Недра». Все права защищены.</span>
      </div>
            </div>
    </footer>
  );
};

export default Footer;
