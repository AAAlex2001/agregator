"use client";

import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { usePostsLogin } from "../../model/login-context";

/** Открывает редактор публикации, а гостю — окно входа. */
export function WritePostButton() {
  const { user } = useUser();
  const openLogin = usePostsLogin();

  if (user) {
    return <Button href="/posts/new">Написать пост</Button>;
  }

  return <Button onClick={openLogin}>Написать пост</Button>;
}
