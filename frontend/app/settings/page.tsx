import { SettingsWidget } from "@/source/widgets/profile/settings";

interface SettingsPageProps {
  searchParams: Promise<{ section?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;

  return (
    <SettingsWidget initialSection={params.section === "finance" ? "finance" : "personal"} />
  );
}
