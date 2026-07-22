"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { ExpertAttestationFields, type ExpertCertificate } from "@/source/entities/expertise";
import { updateExpertCertificates } from "@/source/entities/user/api/profile.api";
import type { UserProfile } from "@/source/entities/user";
import form from "@/source/entities/user/ui/ProfileForm.module.scss";
import { ExpertContactOfferSection } from "./ExpertContactOfferSection";
import s from "./ExpertLocationSection.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

const DEFAULT_MAP_FIELDS = ["name", "area", "object", "category"];

export function ExpertCertificatesSection({ profile, onProfileUpdate }: Props) {
  const { showSuccess, showError } = useNotifications();
  const [certificates, setCertificates] = useState<ExpertCertificate[]>(
    profile.expert_certificates ?? [],
  );
  const [showOnMap, setShowOnMap] = useState(profile.expert_show_on_map);
  const [mapFields, setMapFields] = useState<string[]>(
    profile.expert_map_fields ?? DEFAULT_MAP_FIELDS,
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateExpertCertificates({
        certificates,
        show_on_map: showOnMap,
        map_fields: mapFields,
      });
      onProfileUpdate(updated);
      showSuccess("Удостоверения сохранены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить удостоверения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={form.section}>
      <h2 className={form.subtitle}>Удостоверения</h2>
      <div className={s.body}>
        <ExpertAttestationFields
          certificates={certificates}
          showOnMap={showOnMap}
          mapFields={mapFields}
          onChangeCertificates={setCertificates}
          onChangeShowOnMap={setShowOnMap}
          onChangeMapFields={setMapFields}
        />
        <ExpertContactOfferSection />
        <div className={s.actions}>
          <Button type="button" variant="primary" fullWidth onClick={save} isLoading={saving}>
            Сохранить удостоверения
          </Button>
        </div>
      </div>
    </section>
  );
}
