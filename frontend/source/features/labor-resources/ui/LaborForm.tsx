"use client";

import { Button } from "@/source/shared/ui";
import { useLaborForm } from "../model/useLaborForm";
import type { LaborPageMode } from "../model/types";
import { EmploymentTermFields } from "./EmploymentTermFields";
import { ExpertCertificatesField } from "./ExpertCertificatesField";
import { ExpertEmploymentFields } from "./ExpertEmploymentFields";
import { LaborFormUnavailable } from "./LaborFormUnavailable";
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

  if (!form.canCreate) {
    return (
      <LaborFormUnavailable
        mode={mode}
        title={form.copy.formTitle}
      />
    );
  }

  return (
    <form className={s.form} onSubmit={form.submit}>
      <h2 className={s.title}>{form.copy.formTitle}</h2>

      {mode === "license" ? (
        <LicenseExpertiseFields
          areas={form.areas}
          category={form.category}
          onToggleArea={form.toggleArea}
          onCategoryChange={form.setCategory}
        />
      ) : (
        <ExpertCertificatesField
          certificates={form.profileCertificates}
        />
      )}

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
    </form>
  );
}
