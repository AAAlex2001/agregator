import type { CurrentJobStatus } from "@/source/entities/labor";
import { RadioGroup } from "@/source/shared/ui";

interface ExpertEmploymentFieldsProps {
  jobStatus: CurrentJobStatus;
  onJobStatusChange: (value: CurrentJobStatus) => void;
}

export function ExpertEmploymentFields({
  jobStatus,
  onJobStatusChange,
}: ExpertEmploymentFieldsProps) {
  return (
    <RadioGroup
      name="job-status"
      value={jobStatus}
      onChange={onJobStatusChange}
      legend="В настоящее время основное место работы"
      options={[
        {
          value: "NONE",
          label: "Отсутствует",
        },
        {
          value: "EMPLOYED",
          label: "Имеется",
          description: "Для трудоустройства потребуется увольнение",
        },
      ]}
    />
  );
}
