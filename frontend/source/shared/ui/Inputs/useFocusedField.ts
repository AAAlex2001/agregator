"use client";

import { useState, type FocusEvent } from "react";

export function useFocusedField() {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = (_: FocusEvent<HTMLInputElement>) => setIsFocused(true);
  const onBlur = (_: FocusEvent<HTMLInputElement>) => setIsFocused(false);
  return { isFocused, onFocus, onBlur };
}
