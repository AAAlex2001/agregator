import { useSession } from "@/entites/session";
import { isTelegram } from "@/shared/services/telegram";
import { Spinner } from "@/shared/ui";
import { TelegramOnly } from "@/widgets/telegram-only";
import { AuthPage } from "@/pages/auth-page";
import { HomePage } from "@/pages/home-page";

export function App() {
  const { booting, authed } = useSession();

  if (import.meta.env.PROD && !isTelegram) {
    return (
      <div className="app">
        <TelegramOnly />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-body">
        {booting ? <Spinner page /> : authed ? <HomePage /> : <AuthPage />}
      </div>
    </div>
  );
}
