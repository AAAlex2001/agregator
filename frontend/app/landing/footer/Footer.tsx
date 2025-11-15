import Link from "next/link";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer} id="footer">
        <div className={styles.content}>
      <div className={styles.primary}>
        <span className={styles.logo}>Agregator</span>
        <p>Соединяем данные, процессы и людей в единую экосистему.</p>
      </div>
      <div className={styles.links}>
        <div>
          <h4>Платформа</h4>
          <Link href="#hero">Обзор</Link>
          <Link href="#advantages">Преимущества</Link>
          <Link href="#orders">Сценарии</Link>
        </div>
        <div>
          <h4>Ресурсы</h4>
          <Link href="#how-it-works">Документация</Link>
          <Link href="#reviews">Отзывы</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        <div>
          <h4>Правовая информация</h4>
          <Link href="#privacy">Политика</Link>
          <Link href="#terms">Условия</Link>
          <Link href="#agreement">Договор</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Agregator. Все права защищены.</span>
        <Link href="mailto:hello@agregator.io">hello@agregator.io</Link>
      </div>
            </div>
    </footer>
  );
};

export default Footer;

