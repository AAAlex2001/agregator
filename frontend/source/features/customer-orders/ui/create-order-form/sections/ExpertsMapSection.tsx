"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap, type ExpertMapItemApi } from "@/source/entities/expert";
import { YandexMarkersMap, type MapMarker } from "@/source/shared/ui/YandexMap";
import base from "./sectionBase.module.scss";
import s from "./expertsMapSection.module.scss";

function toMarker(item: ExpertMapItemApi): MapMarker {
  return {
    id: item.public_id,
    lat: item.lat,
    lng: item.lng,
    title: item.full_name,
    city: item.city,
    rating: item.rating,
    travelsToOtherRegions: item.travels_to_other_regions,
    attested: item.attested,
    certificates: item.certificates,
    phone: item.phone,
    email: item.email,
  };
}

export function ExpertsMapSection() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    let active = true;
    fetchExpertsMap()
      .then((data) => {
        if (active) setMarkers(data.items.map(toMarker));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={base.section}>
      <span className={base.label}>Эксперты на карте</span>
      <p className={s.hint}>
        Посмотрите, где находятся эксперты площадки, — это поможет выбрать исполнителя ближе к объекту.
        Точки кластеризуются; нажмите на маркер, чтобы увидеть эксперта.
      </p>
      <YandexMarkersMap
        markers={markers}
        height={420}
        emptyText="Пока нет экспертов с указанной локацией"
      />
    </section>
  );
}
