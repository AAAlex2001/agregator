import styles from "./cta-footer.module.scss";

const CtaFooter = () => {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaLeft}>
            <span className={styles.ctaChip}>Действуйте прямо сейчас</span>
            <h2>Найдите эксперта по промбезопасности или заявите о своей специализации</h2>
          </div>
          <div className={styles.ctaRight}>
            <h3>После регистрации вы сможете:</h3>
            <ul>
              <li>Разместить заказ и получить первые отклики уже сегодня — не теряйте время на долгий поиск</li>
              <li>Находить проекты именно по вашей аттестации — удобная система фильтрации поиска заказов</li>
              <li>Вести переговоры напрямую без посредников</li>
              <li>Строить долгосрочную репутацию в профессиональном обществе</li>
            </ul>
            <div className={styles.ctaActions}>
              <button className={styles.primaryBtn}>
                Найти эксперта <span aria-hidden="true" className={styles.arrow}>→</span>
              </button>
              <button className={styles.secondaryBtn}>
                Стать экспертом на платформе
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CtaFooter;

