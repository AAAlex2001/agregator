import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { telegramAuth, telegramLink, logout as apiLogout, type Role } from "@/shared/services/api";
import { getInitData } from "@/shared/services/telegram";
import { getAvailableRoles, getProfile, type AvailableRole, type Profile } from "@/entites/profile";

interface SessionValue {
  booting: boolean;
  authed: boolean;
  linkRequired: boolean;
  role: Role | null;
  profile: Profile | null;
  availableRoles: AvailableRole[];
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
  const [availableRoles, setAvailableRoles] = useState<AvailableRole[]>([]);

  const reloadProfile = async () => {
    try {
      const next = await getProfile();
      setProfile(next);
      setRole(next.role);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!authed) {
      setProfile(null);
      setAvailableRoles([]);
      return;
    }
    let active = true;
    void (async () => {
      try {
        const next = await getProfile();
        if (!active) return;
        setProfile(next);
        setRole(next.role);
        const resp = await getAvailableRoles().catch(() => ({ roles: [] as AvailableRole[] }));
        if (!active) return;
        const others = resp.roles.filter((r) => r.role !== next.role);
        setAvailableRoles([{ role: next.role, email_verified: true }, ...others]);
      } catch {
        if (active) setProfile(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [authed]);

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

  const signInLink = async (email: string, password: string, signRole?: Role) => {
    const resp = await telegramLink(getInitData(), email, password, signRole);
    setRole(resp.role ?? null);
    setLinkRequired(false);
    setAuthed(true);
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch {
      setAuthed(false);
    }
    setAuthed(false);
    setRole(null);
    setLinkRequired(true);
  };

  return (
    <SessionContext.Provider
      value={{ booting, authed, linkRequired, role, profile, availableRoles, signInLink, signOut, reloadProfile }}
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
