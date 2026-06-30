import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { initTelegram } from "@/shared/services/telegram";
import { SessionProvider } from "@/entites/session";
import { ErrorModal } from "@/widgets/error-modal";
import { App } from "@/app";
import "@/shared/styles/index.css";

initTelegram();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
        <ErrorModal />
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
);
