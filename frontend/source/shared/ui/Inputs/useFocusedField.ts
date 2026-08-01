"use client";

import { useState } from "react";

export function useFocusedField() {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);
  return { isFocused, onFocus, onBlur };
}
