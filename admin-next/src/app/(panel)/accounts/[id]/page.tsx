import { parseId } from "@/shared/lib/route-params";
import AccountProfile from "@/widgets/admin/account";

/** Профиль учётной записи. */
export default async function AccountRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AccountProfile key={id} accountId={parseId(id)} />;
}
