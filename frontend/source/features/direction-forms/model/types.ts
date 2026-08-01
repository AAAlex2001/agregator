import type { DirectionCatalogs, DirectionProfile } from "@/source/entities/direction";

/** Контракт любой анкеты направления: значение, обработчик и справочники. */
export interface DirectionFormProps {
  value: DirectionProfile;
  onChange: (value: DirectionProfile) => void;
  catalogs: DirectionCatalogs;
}

export type DirectionFormComponent = (props: DirectionFormProps) => React.ReactElement | null;
