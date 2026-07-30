import { Field, FileRow, FullSheet, InfoRow, SheetHero } from "@/shared/ui";
import { formatRental, licenseHolderName, type LicenseHolder } from "@/entites/license-holder";
import s from "./license-holder-sheet.module.scss";

export function LicenseHolderSheet({ holder, onClose }: { holder: LicenseHolder | null; onClose: () => void }) {
  const areas = holder?.license_areas ?? [];
  const hasExtras = Boolean(
    holder &&
      (holder.mining_license_number ||
        holder.mining_license_file_url ||
        holder.sro_design_file_url ||
        holder.lab_accreditation_number ||
        holder.lab_accreditation_file_url),
  );

  return (
    <FullSheet
      open={holder !== null}
      onClose={onClose}
      hero={
        holder && (
          <SheetHero
            light="/profile-hero/license-light.webp"
            dark="/profile-hero/license-dark.webp"
            label="Держатель разрешительных документов"
            title={licenseHolderName(holder)}
            desc="Компания, предоставляющая лицензию"
            onClose={onClose}
          />
        )
      }
    >
      {holder && (
        <div className={s.body}>
          <Field label="Организация">
            <div className={s.block}>
              {holder.inn && <InfoRow label="ИНН" value={holder.inn} />}
              {holder.license_number && <InfoRow label="Лицензия №" value={holder.license_number} />}
              <InfoRow label="Стоимость предоставления лицензии" value={formatRental(holder)} accent />
            </div>
          </Field>

          {(holder.phone || holder.email) && (
            <Field label="Контакты">
              <div className={s.block}>
                {holder.phone && (
                  <a className={s.contactRow} href={`tel:${holder.phone}`}>
                    <span className={s.contactLab}>Телефон</span>
                    <span className={s.contactVal}>{holder.phone}</span>
                  </a>
                )}
                {holder.email && (
                  <a className={s.contactRow} href={`mailto:${holder.email}`}>
                    <span className={s.contactLab}>Почта</span>
                    <span className={s.contactVal}>{holder.email}</span>
                  </a>
                )}
              </div>
            </Field>
          )}

          {areas.length > 0 && (
            <Field label="Области лицензии">
              <div className={s.block}>
                <div className={s.chips}>
                  {areas.map((area) => (
                    <span key={area} className={s.chip}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </Field>
          )}

          {(holder.license_file_url || holder.company_card_url) && (
            <Field label="Документы">
              <div className={s.files}>
                {holder.license_file_url && <FileRow url={holder.license_file_url} />}
                {holder.company_card_url && <FileRow url={holder.company_card_url} />}
              </div>
            </Field>
          )}

          {hasExtras && (
            <Field label="Дополнительные разрешительные документы">
              <div className={s.extras}>
                {holder.mining_license_number && (
                  <div className={s.block}>
                    <InfoRow label="Лицензия на маркшейдерские работы №" value={holder.mining_license_number} />
                  </div>
                )}
                <div className={s.files}>
                  {holder.mining_license_file_url && <FileRow url={holder.mining_license_file_url} />}
                  {holder.sro_design_file_url && <FileRow url={holder.sro_design_file_url} />}
                </div>
                {holder.lab_accreditation_number && (
                  <div className={s.block}>
                    <InfoRow label="Аккредитация лаборатории №" value={holder.lab_accreditation_number} />
                  </div>
                )}
                {holder.lab_accreditation_file_url && (
                  <div className={s.files}>
                    <FileRow url={holder.lab_accreditation_file_url} />
                  </div>
                )}
              </div>
            </Field>
          )}
        </div>
      )}
    </FullSheet>
  );
}
