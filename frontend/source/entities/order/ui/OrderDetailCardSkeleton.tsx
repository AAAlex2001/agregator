import { OrderCardSkeleton } from "./OrderCardSkeleton";

interface Props {
  showQuestions?: boolean;
  showActions?: boolean;
}

export function OrderDetailCardSkeleton(_props: Props) {
  return <OrderCardSkeleton showActions={_props.showActions} />;
}
