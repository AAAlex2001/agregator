import { RoleGuard } from "@/source/entities/session";
import { CreateOrderWidget } from "@/source/widgets/orders";

export default function CreateOrderPage() {
  return (
    <RoleGuard allowed={["CUSTOMER"]}>
      <CreateOrderWidget />
    </RoleGuard>
  );
}
