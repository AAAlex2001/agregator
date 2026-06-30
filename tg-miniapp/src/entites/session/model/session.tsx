import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { telegramAuth, telegramLink, logout as apiLogout, type Role } from "@/shared/services/api";
import { getInitData } from "@/shared/services/telegram";
import { getProfile, type Profile } from "@/entites/profile";

interface SessionValue {
  booting: boolean;
  authed: boolean;
  linkRequired: boolean;
  role: Role | null;
  profile: Profile | null;
  signInLink: (email: string, password: string, role?: Role) => Promise<void>;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [linkRequired, setLinkRequired] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const reloadProfile = useCallback(async () => {
    try {
      setProfile(await getProfile());
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (authed) void reloadProfile();
    else setProfile(null);
  }, [authed, reloadProfile]);

  useEffect(() => {
    const initData = getInitData();
    if (!initData) {
      setBooting(false);
      return;
    }
    telegramAuth(initData)
      .then((resp) => {
        if (resp.linked) {
          setRole(resp.role ?? null);
          setAuthed(true);
        } else {
          setLinkRequired(true);
        }
      })
      .catch(() => setLinkRequired(true))
      .finally(() => setBooting(false));
  }, []);

  const signInLink = useCallback(async (email: string, password: string, signRole?: Role) => {
    const resp = await telegramLink(getInitData(), email, password, signRole);
    setRole(resp.role ?? null);
    setLinkRequired(false);
    setAuthed(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* всё равно сбрасываем локально */
    }
    setAuthed(false);
    setRole(null);
    setLinkRequired(true);
  }, []);

  return (
    <SessionContext.Provider
      value={{ booting, authed, linkRequired, role, profile, signInLink, signOut, reloadProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession вне SessionProvider");
  return ctx;
}
