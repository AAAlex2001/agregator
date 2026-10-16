/** Вид подвала и открытие регистрации из оболочки приложения. */
export interface SiteFooterProps {
  variant?: "dark" | "light";
  onOpenRegister: () => void;
}

/** Ссылка в одной из навигационных колонок подвала. */
export interface FooterLink {
  href: string;
  label: string;
}
