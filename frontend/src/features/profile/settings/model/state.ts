"use client";

import { useState } from "react";

export function usePersonalDataState(initial: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}) {
  const [lastName, setLastName] = useState(initial.lastName);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  return {
    lastName, setLastName,
    firstName, setFirstName,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    repeatPassword, setRepeatPassword,
    isSaving, setIsSaving,
  };
}
