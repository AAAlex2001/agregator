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
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 7C9.84844 7 9.69689 7.05414 9.57781 7.17325L7.17456 9.57704C6.94181 9.80984 6.94181 10.1888 7.17456 10.4216L9.57781 12.8254C9.81056 13.0582 10.1894 13.0582 10.4222 12.8254L12.8254 10.4216C13.0582 10.1888 13.0582 9.80984 12.8254 9.57704L10.4222 7.17325C10.3031 7.05414 10.1516 7 10 7Z" fill="url(#paint0_linear_653_445)"/>
                    <defs>
                      <linearGradient id="paint0_linear_653_445" x1="7" y1="10" x2="13" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFB800"/>
                        <stop offset="1" stopColor="#FF8A00"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={styles.liText}>Разместить заказ и получить первые отклики уже сегодня — не теряйте время на долгий поиск</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 7C9.84844 7 9.69689 7.05414 9.57781 7.17325L7.17456 9.57704C6.94181 9.80984 6.94181 10.1888 7.17456 10.4216L9.57781 12.8254C9.81056 13.0582 10.1894 13.0582 10.4222 12.8254L12.8254 10.4216C13.0582 10.1888 13.0582 9.80984 12.8254 9.57704L10.4222 7.17325C10.3031 7.05414 10.1516 7 10 7Z" fill="url(#paint0_linear_653_445)"/>
                    <defs>
                      <linearGradient id="paint0_linear_653_445" x1="7" y1="10" x2="13" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFB800"/>
                        <stop offset="1" stopColor="#FF8A00"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={styles.liText}>Находить проекты именно по вашей аттестации — удобная система фильтрации поиска заказов</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 7C9.84844 7 9.69689 7.05414 9.57781 7.17325L7.17456 9.57704C6.94181 9.80984 6.94181 10.1888 7.17456 10.4216L9.57781 12.8254C9.81056 13.0582 10.1894 13.0582 10.4222 12.8254L12.8254 10.4216C13.0582 10.1888 13.0582 9.80984 12.8254 9.57704L10.4222 7.17325C10.3031 7.05414 10.1516 7 10 7Z" fill="url(#paint0_linear_653_445)"/>
                    <defs>
                      <linearGradient id="paint0_linear_653_445" x1="7" y1="10" x2="13" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFB800"/>
                        <stop offset="1" stopColor="#FF8A00"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={styles.liText}>Вести переговоры напрямую без посредников</span>
              </li>
              <li>
                <span aria-hidden="true" className={styles.bullet}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 7C9.84844 7 9.69689 7.05414 9.57781 7.17325L7.17456 9.57704C6.94181 9.80984 6.94181 10.1888 7.17456 10.4216L9.57781 12.8254C9.81056 13.0582 10.1894 13.0582 10.4222 12.8254L12.8254 10.4216C13.0582 10.1888 13.0582 9.80984 12.8254 9.57704L10.4222 7.17325C10.3031 7.05414 10.1516 7 10 7Z" fill="url(#paint0_linear_653_445)"/>
                    <defs>
                      <linearGradient id="paint0_linear_653_445" x1="7" y1="10" x2="13" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFB800"/>
                        <stop offset="1" stopColor="#FF8A00"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={styles.liText}>Строить долгосрочную репутацию в профессиональном обществе</span>
              </li>
            </ul>
            <div className={styles.ctaActions}>
              <button className={styles.primaryBtn}>
                Найти эксперта
                <span aria-hidden="true" className={styles.arrow}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12L13 18M19 12L13 6M19 12H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
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

