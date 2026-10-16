import type { ExpertRegistration } from "../../model/expert";
import { getExpertDirections } from "../../model/expert-directions";
import type { RegistrationFiles } from "../../model/files";
import { AuditDirection } from "../audit-direction";
import { CadastralDirection } from "../cadastral-direction";
import { DesignDirection } from "../design-direction";
import { DirectionList } from "../direction-list";
import { EcologyDirection } from "../ecology-direction";
import { ExpertiseDirection } from "../expertise-direction";
import { ForensicDirection } from "../forensic-direction";
import { LaboratoryDirection } from "../laboratory-direction";
import { LocationFields } from "../location-fields";
import { ResearchDirection } from "../research-direction";
import { SurveyDirection } from "../survey-direction";
import { TechDiagDirection } from "../tech-diag-direction";

/** Направления исполнителя и владелец локальных файлов регистрации. */
interface ExpertFieldsProps {
  value: ExpertRegistration;
  onChange: (value: ExpertRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает самостоятельные анкеты направлений и расположение исполнителя. */
export function ExpertFields({ value, onChange, files }: ExpertFieldsProps) {
  return (
    <>
      <DirectionList>
        <ExpertiseDirection
          value={value.expertise}
          onChange={(expertise) => onChange({ ...value, expertise })}
        />
        <AuditDirection
          value={value.audit}
          onChange={(audit) => onChange({ ...value, audit })}
          files={files}
        />
        <CadastralDirection
          value={value.cadastral}
          onChange={(cadastral) => onChange({ ...value, cadastral })}
          files={files}
        />
        <ForensicDirection
          value={value.forensic}
          onChange={(forensic) => onChange({ ...value, forensic })}
          files={files}
        />
        <ResearchDirection
          value={value.research}
          onChange={(research) => onChange({ ...value, research })}
        />
        <LaboratoryDirection
          value={value.laboratory}
          onChange={(laboratory) => onChange({ ...value, laboratory })}
        />
        <TechDiagDirection
          value={value.techDiag}
          onChange={(techDiag) => onChange({ ...value, techDiag })}
          files={files}
        />
        <DesignDirection
          value={value.design}
          onChange={(design) => onChange({ ...value, design })}
          files={files}
        />
        <SurveyDirection
          value={value.survey}
          onChange={(survey) => onChange({ ...value, survey })}
          files={files}
        />
        <EcologyDirection
          value={value.ecology}
          onChange={(ecology) => onChange({ ...value, ecology })}
          files={files}
        />
      </DirectionList>
      <LocationFields
        value={value.location}
        onChange={(location) => onChange({ ...value, location })}
        activeDirections={getExpertDirections(value)}
      />
    </>
  );
}

