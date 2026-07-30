"use client";

import { Checkbox } from "@/source/shared/ui";
import { ExpertAttestationFields, type ExpertCertificate } from "@/source/entities/expertise";
import s from "./ExpertAttestationBlock.module.scss";

interface Props {
  confirmed: boolean;
  certificates: ExpertCertificate[];
  showOnMap: boolean;
  mapFields: string[];
  onToggleConfirmed: (value: boolean) => void;
  onChangeCertificates: (value: ExpertCertificate[]) => void;
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
}

export function ExpertAttestationBlock({
  confirmed,
  certificates,
  showOnMap,
  mapFields,
  onToggleConfirmed,
  onChangeCertificates,
  onChangeShowOnMap,
  onChangeMapFields,
}: Props) {
  return (
    <div className={s.block}>
      <Checkbox id="expert-confirmed" checked={confirmed} onChange={onToggleConfirmed}>
        <span className={s.title}>Я являюсь аттестованным исполнителем</span>
        <span className={s.hint}>
          Укажите аттестацию — она поможет заказчикам найти вас на карте России
        </span>
      </Checkbox>

      {confirmed && (
        <div className={s.reveal}>
          <ExpertAttestationFields
            certificates={certificates}
            showOnMap={showOnMap}
            mapFields={mapFields}
            onChangeCertificates={onChangeCertificates}
            onChangeShowOnMap={onChangeShowOnMap}
            onChangeMapFields={onChangeMapFields}
          />
        </div>
      )}
    </div>
  );
}
