"use client";

import { useContext } from "react";
import { SessionContext } from "./context";

export function useSession() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return value;
}
