import { SettingsPageContent } from "../../../ui/pages/settings-page-content";

/** Вкладка настроек из ссылки. */
interface SettingsPageProps {
  searchParams: Promise<{ section?: string | string[] }>;
}

/** Открывает настройки аккаунта на вкладке из адреса. */
export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const section = typeof params.section === "string" ? params.section : null;

  return <SettingsPageContent section={section} />;
}
