import { useEffect, useState } from "react";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { tapHaptic } from "@/shared/services/telegram";
import type { Order } from "@/entites/order";
import { InfoScreen } from "./screens/info-screen";
import { DocumentsScreen } from "./screens/documents-screen";
import { ExecutorScreen } from "./screens/executor-screen";
import { QuestionsScreen } from "./screens/questions-screen";

const TOTAL = 4;
type ScreenMeta = { image: string; title: string; desc: string };

const META: Record<number, ScreenMeta> = {
  1: { image: "step-1", title: "Информация по заказу", desc: "Условия завершённого заказа" },
  2: { image: "step-2", title: "Документы заказчика", desc: "ТЗ, договор и другие вложения" },
  3: { image: "step-4", title: "Исполнитель", desc: "Кто выполнял заказ и на каких условиях" },
  4: { image: "step-3", title: "Вопросы по заказу", desc: "Обсуждение с заказчиком" },
};

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function ArchiveSheet({ order, onClose }: Props) {
  const open = order !== null;
  const [screen, setScreen] = useState(1);

  useEffect(() => {
    if (open) setScreen(1);
  }, [open]);

  const close = () => {
    tapHaptic();
    onClose();
  };

  const meta = META[screen];

  return (
    <FullSheet
      open={open}
      onClose={close}
      scrollKey={screen}
      hero={
        <SheetHero
          key={meta.image}
          light={`/respond-order/${meta.image}-light.webp`}
          dark={`/respond-order/${meta.image}-dark.webp`}
          label="Архив"
          title={meta.title}
          desc={meta.desc}
          step={screen}
          total={TOTAL}
          onClose={close}
        />
      }
      footer={
        screen === 1 ? (
          <Button onClick={() => setScreen(2)}>Далее</Button>
        ) : screen === TOTAL ? (
          <>
            <Button variant="outline" onClick={() => setScreen(screen - 1)}>Назад</Button>
            <Button onClick={close}>Закрыть</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setScreen(screen - 1)}>Назад</Button>
            <Button onClick={() => setScreen(screen + 1)}>Далее</Button>
          </>
        )
      }
    >
      {order && (
        <>
          {screen === 1 && <InfoScreen order={order} />}
          {screen === 2 && <DocumentsScreen order={order} />}
          {screen === 3 && <ExecutorScreen order={order} />}
          {screen === 4 && <QuestionsScreen orderId={order.id} />}
        </>
      )}
    </FullSheet>
  );
}
