"use client";

import { motion } from "framer-motion";

export function SuccessScreen({ styles }: { styles: Record<string, string> }) {
  return (
    <div className={styles.successContainer}>
      <motion.div
        className={styles.successCircle}
        initial={{ scale: 25, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      <motion.svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        className={styles.checkmark}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <motion.path d="M5 13l4 4L19 7" stroke="#FF8A00" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <motion.h2
        className={styles.successTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Успешно
      </motion.h2>
      <motion.p
        className={styles.successText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        Вы обновили пароль.<br />
        Через мгновение продолжите<br />
        вход с новым паролем
      </motion.p>
    </div>
  );
}
