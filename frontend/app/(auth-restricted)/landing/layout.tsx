import { LandingHeaderAuthed } from "@/source/widgets/landing";

export default function AuthedLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <LandingHeaderAuthed />
      {children}
    </>
  );
}
