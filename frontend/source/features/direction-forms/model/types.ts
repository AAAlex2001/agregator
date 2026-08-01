import type { ReactElement } from "react";
import type { DirectionCatalogs } from "@/source/entities/direction";

export interface DirectionFormProps<TProfile> {
  value: TProfile;
  onChange: (value: TProfile) => void;
  catalogs: DirectionCatalogs;
}

export type DirectionFormComponent<TProfile> = (
  props: DirectionFormProps<TProfile>,
) => ReactElement | null;
