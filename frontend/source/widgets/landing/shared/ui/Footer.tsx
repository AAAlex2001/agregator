import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/source/shared/ui/icons/LogoIcon";
import { AuthLinkButton } from "@/source/shared/ui/AuthTrigger";
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
        <Link href="/" className={s.logo} aria-label="На главную">
          <LogoIcon title="Ресурс-Плюс" />
        </Link>

          <p>Площадка для аттестованных исполнителей промышленной безопасности</p>
          </div>
              <div className={s.links}>
                <div>
                  <h2>Направления</h2>
                  <Link href="/ekspertiza-promyshlennoy-bezopasnosti">Экспертиза промышленной безопасности</Link>
                  <Link href="/proektirovanie">Проектирование объектов</Link>
                  <Link href="/audit-supb">Аудит СУПБ</Link>
                  <Link href="/tehnicheskoe-diagnostirovanie">Техническое диагностирование</Link>
                  <Link href="/nir">НИР и лабораторные исследования</Link>
                  <Link href="/kadastrovye-raboty">Кадастровые работы</Link>
                  <Link href="/sudebnaya-ekspertiza">Судебная экспертиза</Link>
                </div>
                <div>
                  <h2>Платформа</h2>
                  <Link href="/">О платформе</Link>
                  <Link href="/#advantages">Почему выбирают нас</Link>
                  <Link href="/#faq">Частые вопросы</Link>
                  <Link href="/orders">Заказы и тендеры</Link>
                  <Link href="/reviews">Отзывы</Link>
                  <Link href="/news">Новости отрасли</Link>
                  <Link href="/blog">Блог платформы</Link>
                </div>
                <div>
                  <h2>Сервисы</h2>
                  <Link href="/zepb-registry">Реестр заключений ЭПБ</Link>
                  <Link href="/expert-contacts">Контакты исполнителей</Link>
                  <Link href="/rtn">Разъяснения Ростехнадзора</Link>
                  <Link href="/rtn/ask">Задать вопрос в Ростехнадзор</Link>
                  <Link href="/training/defectoscopist-certification">Обучение дефектоскопистов</Link>
                </div>
                <div>
                  <h2>Начать работу</h2>
                  <AuthLinkButton tab="register">Разместить заказ</AuthLinkButton>
                  <AuthLinkButton tab="register">Создать профиль исполнителя</AuthLinkButton>
                  <AuthLinkButton tab="register">Разместить разрешительные документы</AuthLinkButton>
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
      </div>
      <div className={s.bottom}>
        <div className={s.bottomLinks}>
            <span>*Исполнители экспертизы промышленной безопасности имеют аттестацию Ростехнадзора согласно
            <a href="https://www.gosnadzor.ru/service/list/certification%20experts/%D0%9F%D1%80-287%20%D0%BE%D1%82%2031.08.2022.pdf?ysclid=mi265psds810889564"
               target="_blank"
               rel="noopener noreferrer"
               title="Открыть Приказ № 287 от 31.08.2022 г.">
            Приказу № 287 от 31.08.2022 г.
            </a>
            </span>
        </div>
          <span>© {new Date().getFullYear()} ООО «НПИ «Недра». Все права защищены.</span>
      </div>
            </div>
    </footer>
  );
};

export default Footer;
