import { LoginForm } from "@/features/admin-auth";
import styles from "./page.module.scss";

/** Вход в админку. */
export default function LoginRoute() {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
}
