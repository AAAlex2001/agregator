"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap, type ExpertMapItemApi } from "@/source/entities/expert";
import { YandexMarkersMap, type MapMarker } from "@/source/shared/ui/YandexMap";
import s from "./heroExpertsMap.module.scss";

function toMarker(item: ExpertMapItemApi): MapMarker {
  return {
    id: item.public_id,
    lat: item.lat,
    lng: item.lng,
    title: item.full_name,
    city: item.city,
    rating: item.rating,
    travelsToOtherRegions: item.travels_to_other_regions,
    certificates: item.certificates,
    phone: item.phone,
    email: item.email,
  };
}

export function HeroExpertsMap() {
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
    <div className={s.wrap}>
      <h2 className={s.heading}>Эксперты промышленной безопасности на карте России</h2>
      <p className={s.sub}>
        Аттестованные эксперты Ростехнадзора по всей стране — выбирайте исполнителя ближе к вашему
        опасному производственному объекту.
      </p>
      <YandexMarkersMap markers={markers} height={360} emptyText="Загрузка карты экспертов…" />
    </div>
  );
}
