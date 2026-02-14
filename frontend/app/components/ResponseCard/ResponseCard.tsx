"use client";

import ConsiderationCard from "@/app/components/ResponseCards/Consideration";
import type { ConsiderationCardProps } from "@/app/components/ResponseCards/Consideration";

export type { ResponseBadge } from "@/app/components/ResponseCards/types";

export type ResponseCardProps = ConsiderationCardProps;

const ResponseCard = (props: ResponseCardProps) => {
  return <ConsiderationCard {...props} />;
};

export default ResponseCard;
