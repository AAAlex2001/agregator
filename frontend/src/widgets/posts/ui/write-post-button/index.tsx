"use client";

import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { usePostsLogin } from "../../model/login-context";
import { NewPostMenu } from "../new-post-menu";

/** Вошедшему — выбор, куда писать пост; гостю — окно входа. */
export function WritePostButton() {
  const { user } = useUser();
  const openLogin = usePostsLogin();

  if (user) {
    return <NewPostMenu />;
  }

  return <Button onClick={openLogin}>Новый пост</Button>;
}
