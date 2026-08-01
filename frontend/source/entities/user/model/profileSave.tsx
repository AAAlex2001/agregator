"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type ProfileSaver = () => Promise<void>;
type RegisterProfileSave = (saver: ProfileSaver) => () => void;

const ProfileSaveContext = createContext<RegisterProfileSave | null>(null);

export function useProfileSavers() {
  const [registry] = useState(() => {
    const savers = new Set<ProfileSaver>();
    return {
      register(saver: ProfileSaver) {
        savers.add(saver);
        return () => {
          savers.delete(saver);
        };
      },
      async runSavers() {
        for (const saver of savers) {
          await saver();
        }
        return savers.size;
      },
    };
  });

  return registry;
}

interface ProviderProps {
  register: RegisterProfileSave;
  children: ReactNode;
}

export function ProfileSaveProvider({ register, children }: ProviderProps) {
  return <ProfileSaveContext.Provider value={register}>{children}</ProfileSaveContext.Provider>;
}

export function useRegisterProfileSave(save: ProfileSaver) {
  const register = useContext(ProfileSaveContext);
  const latest = useRef(save);

  useEffect(() => {
    latest.current = save;
  });

  useEffect(() => {
    if (!register) return;
    return register(() => latest.current());
  }, [register]);
}
