import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { hideBackButton, isTelegram, showBackButton } from "@/shared/services/telegram";
import { Spinner } from "@/shared/ui";
import { TelegramOnly } from "@/widgets/telegram-only";
import { AuthPage } from "@/pages/auth-page";
import { HomePage } from "@/pages/home-page";
import { ProfilePage } from "@/pages/profile-page";
import { NotificationsPage } from "@/pages/notifications-page";
import { PricingPage } from "@/pages/pricing-page";
import { EditNamePage } from "@/pages/edit-name-page";
import { EditPhonePage } from "@/pages/edit-phone-page";
import { EditEmailPage } from "@/pages/edit-email-page";

export function App() {
  const { booting, authed } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authed && location.pathname !== "/") {
      showBackButton(() => navigate(-1));
    } else {
      hideBackButton();
    }
    return () => hideBackButton();
  }, [authed, location.pathname, navigate]);

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
        {booting ? (
          <Spinner page />
        ) : !authed ? (
          <AuthPage />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/edit-name" element={<EditNamePage />} />
            <Route path="/edit-phone" element={<EditPhonePage />} />
            <Route path="/edit-email" element={<EditEmailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
