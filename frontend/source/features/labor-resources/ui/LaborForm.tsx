"use client";

import { Button } from "@/source/shared/ui";
import { useLaborForm } from "../model/useLaborForm";
import type { LaborPageMode } from "../model/types";
import { EmploymentTermFields } from "./EmploymentTermFields";
import { ExpertCertificatesField } from "./ExpertCertificatesField";
import { ExpertEditableCertificatesField } from "./ExpertEditableCertificatesField";
import { ExpertEmploymentFields } from "./ExpertEmploymentFields";
import { LaborRegionField } from "./LaborRegionField";
import { LicenseEmploymentFields } from "./LicenseEmploymentFields";
import { LicenseExpertiseFields } from "./LicenseExpertiseFields";
import s from "./LaborForm.module.scss";

interface LaborFormProps {
  mode: LaborPageMode;
  onCreated: () => void;
}

export function LaborForm({
  mode,
  onCreated,
}: LaborFormProps) {
  const form = useLaborForm({ mode, onCreated });
  const useProfileCertificates =
    mode === "expert" && form.profileCertificates.length > 0;

  return (
    <form className={s.form} onSubmit={form.submit}>
      <h2 className={s.title}>{form.copy.formTitle}</h2>

      <div className={s.formGrid}>
        <div className={s.formColumn}>
          {useProfileCertificates ? (
            <ExpertCertificatesField
              certificates={form.profileCertificates}
            />
          ) : mode === "expert" ? (
            <ExpertEditableCertificatesField
              certificateCodes={form.certificateCodes}
              category={form.category}
              otherProfession={form.otherProfession}
              otherProfessionText={form.otherProfessionText}
              onCertificateCodesChange={form.setCertificateCodes}
              onCategoryChange={form.setCategory}
              onOtherProfessionToggle={form.setOtherProfession}
              onOtherProfessionTextChange={form.setOtherProfessionText}
            />
          ) : (
            <LicenseExpertiseFields
              expertiseMode={form.expertiseMode}
              certificateCodes={form.certificateCodes}
              expertiseTypes={form.expertiseTypes}
              category={form.category}
              otherProfession={form.otherProfession}
              otherProfessionText={form.otherProfessionText}
              onExpertiseModeChange={form.setExpertiseMode}
              onCertificateCodesChange={form.setCertificateCodes}
              onExpertiseTypesChange={form.setExpertiseTypes}
              onCategoryChange={form.setCategory}
              onOtherProfessionToggle={form.setOtherProfession}
              onOtherProfessionTextChange={form.setOtherProfessionText}
            />
          )}
        </div>

        <div className={s.formColumn}>
          <LaborRegionField
            value={form.region}
            onChange={form.setRegion}
          />

          <EmploymentTermFields
            mode={mode}
            term={form.term}
            fixedTerm={form.fixedTerm}
            onTermChange={form.setTerm}
            onFixedTermChange={form.setFixedTerm}
          />
        </div>

        <div className={s.formColumn}>
          {mode === "license" ? (
            <LicenseEmploymentFields
              startDate={form.startDate}
              employmentType={form.employmentType}
              onStartDateChange={form.setStartDate}
              onEmploymentTypeChange={form.setEmploymentType}
            />
          ) : (
            <ExpertEmploymentFields
              jobStatus={form.jobStatus}
              onJobStatusChange={form.setJobStatus}
            />
          )}
        </div>
      </div>

      <div className={s.formFooter}>
        {form.error && <p className={s.error}>{form.error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={form.submitting}
        >
          Опубликовать заявку
        </Button>
      </div>
    </form>
  );
}
