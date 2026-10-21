"use client";

import { TariffsGrid, useBlitzTariffs } from "@/features/blitz-admin";
import { BLITZ_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Panel from "@/shared/ui/panel";

/** Тарифы Блиц-эксперта: ориентир цены в форме заявки. Заказчик может указать свою цену. */
const BlitzTariffs = () => {
  const tariffs = useBlitzTariffs();

  return (
    <Page>
      <PageHeader
        backHref={BLITZ_PATH}
        title="Тарифы Блиц-эксперта"
        description="Ориентир цены по паре «область × объект». Пустая ячейка — «по запросу»"
        action={
          <Button loading={tariffs.saving} disabled={!tariffs.catalog} onClick={() => void tariffs.save()}>
            Сохранить
          </Button>
        }
      />
      {tariffs.error && <Message tone="error">{tariffs.error}</Message>}
      {!tariffs.catalog && !tariffs.error && <Loader size="lg" />}
      {tariffs.catalog && (
        <Panel title="Цены, ₽">
          <TariffsGrid catalog={tariffs.catalog} values={tariffs.values} onChange={tariffs.changeValue} />
        </Panel>
      )}
    </Page>
  );
};

export default BlitzTariffs;
