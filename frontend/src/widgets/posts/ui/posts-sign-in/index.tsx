"use client";

import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { usePostsLogin } from "../../model/login-context";
import styles from "./style.module.scss";

/** Предложение войти вместо личного раздела публикаций. */
export function PostsSignIn() {
  const openLogin = usePostsLogin();

  return (
    <section className={styles.access}>
      <Title
        as="h1"
        text="Ваши публикации"
      />
      <Subtitle
        text="Войдите, чтобы писать посты, сохранять интересное и делиться публикациями."
        className={styles.subtitle}
      />
      <Button onClick={openLogin}>Войти</Button>
    </section>
  );
}
